import dayjs from './../lib/dayjs'
import prisma from './../lib/prisma'
import { studentWithPersonCareerAndStatus } from './../prisma/queries'
import { checkBillings } from './../utils/checkBillings'
import { MATRICULADO } from './../utils/constants'
import { sendMail } from './../utils/sendMail'
import { StudentWithBill } from './StudentWithBill'

export default async function updateStudentBillingCron() {
  // Levantamos una conexión con prisma.
  try {
    console.log(
      `==Tarea: Actualización de Morosos : ${dayjs()
        .locale('es')
        .format('HH:mm:ss, dddd, MMMM D, YYYY')}`
    )

    const students = await prisma.student.findMany({
      ...studentWithPersonCareerAndStatus,
      where: { status: { status: MATRICULADO } }
    })

    // Recuperamos los estudiantes activos (matriculados)
    // Iteramos el checkBillings por cada uno y enviamos un mail de información. En caso de OK o en caso de Error
    const studentWithBillings: string[] = []
    students.forEach(async (student) => {
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
      if (studentWithBillingsConstruct.count > 0)
        studentWithBillings.push(StudentWithBill(studentWithBillingsConstruct))
    })

    const mailOptions = {
      from: '"Instituto Universitario Jesús Obrero - Sede Catia" <caja@iujo.edu.ve>',
      to: process.env.NOTIFICATION_MAIL,
      subject: `IUJO CAJA - Generación de Morosos ${dayjs()
        .locale('es')
        .format('dddd, MMMM D, YYYY')}`,
      text:
        studentWithBillings.length >= 1
          ? `A continuación se listan los pendientes de pago generados según morosos del mes.`
          : `No se han generado Nuevos Morosos...`,
      html:
        studentWithBillings.length >= 1
          ? studentWithBillings.join('<br>')
          : `<span>No se han generado Nuevos Morosos...</span>`
    }

    sendMail(mailOptions).then((result) => {
      console.log(
        `============================================================================
  Tarea: Actualización de Morosos ==> Terminada a las: ${dayjs()
    .locale('es')
    .format('HH:mm:ss, dddd, MMMM D, YYYY')}
  Identificación del Mensaje:${result.messageId}
============================================================================`
      )
    })
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
    sendMail(mailOptions).then((result) => {
      console.log(
        `============================================================================
  Tarea: Actualización de Morosos ==> Errada a las: ${dayjs()
    .locale('es')
    .format('HH:mm:ss, dddd, MMMM D, YYYY')}
  Identificación del Mensaje:${result.messageId}
============================================================================`
      )
    })
  }
}
