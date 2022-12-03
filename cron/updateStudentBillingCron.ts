import dayjs from './../lib/dayjs'
import prisma from './../lib/prisma'
import { studentWithPersonCareerAndStatus } from './../prisma/queries'
import { checkBillings, MATRICULADO } from './../utils/checkBillings'
import { sendMail } from './../utils/sendMail'
import { StudentWithBill } from './StudentWithBill'

export default async function updateStudentBillingCron() {
  // Levantamos una conexión con prisma.
  try {
    console.log(
      `Tarea de Actualización agendada Activada a las: ${dayjs()
        .locale('es')
        .format('HH:mm, dddd, MMMM D, YYYY')}`
    )

    const students = await prisma.student.findMany({
      ...studentWithPersonCareerAndStatus,
      where: { statusId: MATRICULADO }
    })

    // Recuperamos los estudiantes activos (matriculados)
    // Iteramos el checkBillings por cada uno y enviamos un mail de información. En caso de OK o en caso de Error
    const studentWithBillings = await Promise.all(
      students.map(async (student) => {
        const { career, person, currentSemester, id } = student
        const {
          docNumber,
          firstName,
          firstLastName,
          docType: { type }
        } = person

        const billings = await checkBillings(student, { onlyNews: true })

        const studentWithBillingsConstruct = {
          student: {
            id,
            firstName,
            firstLastName,
            docNumber,
            type,
            career: career.career,
            currentSemester
          },
          billings:
            billings.length > 0
              ? billings.map((billing) => billing.productName.slice(0, 32) + '...').toLocaleString()
              : '',
          count: billings.length
        }
        if (billings.length > 0) return StudentWithBill(studentWithBillingsConstruct)
        else return ''
      })
    )

    const mailOptions = {
      from: '"Instituto Universitario Jesús Obrero - Sede Catia" <caja@iujo.edu.ve>',
      to: process.env.NOTIFICATION_MAIL,
      subject: `IUJO CAJA - Generación de Morosos ${dayjs()
        .locale('es')
        .format('dddd, MMMM D, YYYY')}`,
      text:
        studentWithBillings.length > 0
          ? `A continuación se listan los pendientes de pago generados según morosos del mes.`
          : `<span>No se han generado Nuevos Morosos...</span>`,
      html:
        studentWithBillings.length > 0
          ? studentWithBillings.join('<br>')
          : `<span>No se han generado Nuevos Morosos...</span>`
    }

    const result = await sendMail(mailOptions)
    console.log(result.messageId)
  } catch (error) {
    const mailOptions = {
      from: '"Instituto Universitario Jesús Obrero - Sede Catia" <caja@iujo.edu.ve>',
      to: process.env.NOTIFICATION_MAIL,
      subject: `IUJO CAJA - ERROR al momento de la Generación de Morosos ${dayjs()
        .locale('es')
        .format('dddd, MMMM D, YYYY')}`,
      text: `A continuación se muestra el error producido al generar los morosos`,
      html: `<pre>${JSON.stringify(error, Object.getOwnPropertyNames(error))}</pre>`
    }
    const result = await sendMail(mailOptions)
    console.log(result.messageId)
  }
}
