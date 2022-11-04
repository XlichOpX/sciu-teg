import { Prisma, Product, Semester, Student } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import dayjs from 'lib/dayjs'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { billing, studentWithPersonCareerAndStatus } from 'prisma/queries'
import { canUserDo } from 'utils/checkPermissions'
import { stringSearch } from 'utils/routePaginate'
import { z } from 'zod'
// Validate typeof id
const documentVal = z.string().min(1).max(12)

const MATRICULADO = 1 // ID of StudentStatus 'Matriculado'

// GET /student/[id]/billing
export default withIronSessionApiRoute(billingHandle, ironOptions)

async function billingHandle(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
    query: { id: docNum },
    session
  } = req
  if (!(await canUserDo(session, 'CREATE_BILLING'))) return res.status(403).send(`Can't read this.`)

  // Validamos que el método utilizado sea GET.
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  // Validamos que el docNum sea un string válido (entre 1 y 12 carácteres)
  const { success } = documentVal.safeParse(docNum)
  if (!success) return res.status(404).send(`Document Number ${docNum} Not Allowed`)

  //Obtenemos al estudiante a partir de su número de identificación (Document Number)
  try {
    const student = await prisma.student.findFirst({
      ...studentWithPersonCareerAndStatus,
      where: { person: { docNumber: stringSearch(docNum) } }
    })
    if (!student) return res.status(404).end(`Student not found`)

    // Obtenemos el semestre actual
    const semester = await prisma.semester.findFirst({ orderBy: { endDate: 'desc' } })
    if (!semester) return res.status(404).end(`Current Semester not found`)

    // Contamos si existen cobros efectuados al semestre actual
    const billingCount = await prisma.billing.count({
      where: {
        student: { id: { equals: student?.id } },
        semesterId: { equals: semester?.id }
      }
    })

    const monthsOfSemester = semester ? calculateMonths(semester) : 0
    // Obtenemos el producto 'mensualidad' de la base de datos
    const monthlyPayment = await prisma.product.findFirst({
      where: { name: { contains: 'Mensualidad', mode: 'insensitive' } }
    })
    if (!monthlyPayment) return res.status(404).end(`Monthly Payment product not found`)
    // Obtenemos el producto 'Inscripción' de la base de datos
    const inscription = await prisma.product.findFirst({
      where: { name: { contains: 'Inscripción', mode: 'insensitive' } }
    })
    if (!inscription) return res.status(404).end(`Inscription product not found`)

    // Generamos los productos correspondiente al semestre (Todas las mensualidades para el semestre actual)
    const createBilling = async () => {
      const data: Prisma.Enumerable<Prisma.BillingCreateManyInput> = []
      const dateToPay = dayjs(semester?.startDate).locale('es').set('date', 1)
      // Iteramos los meses del semestre y creamos los objetos pertinentes de 'cobro'
      for (let i = 0; i < monthsOfSemester; i++) {
        const newMonth = dayjs(semester?.startDate).locale('es').add(i, 'month').format('MMMM')
        const productName = `Mensualidad de ${newMonth} ${semester?.semester}`
        const date = dateToPay.add(i, 'month').toDate()
        data.push(constructBilling(monthlyPayment, student as Student, semester, productName, date))
      }
      // si el semestre tiene menos de 6 meses, entonces creamos una inscripción por cobra
      if (monthsOfSemester < 6) {
        const date = dateToPay.toDate()
        data.push(
          constructBilling(
            inscription,
            student as Student,
            semester,
            `Inscripción del semestre ${semester?.semester}`,
            date
          )
        )
      }

      return await prisma.billing.createMany({ data })
    }

    if (billingCount === 0 && student.status.id === MATRICULADO) await createBilling()

    let billings = await prisma.billing.findMany({
      ...billing,
      where: {
        student: { id: { equals: student?.id } },
        isCharged: { equals: false }
      }
    })

    const latePayment = await prisma.product.findFirst({
      where: { name: { contains: 'Recargo por Retardo', mode: 'insensitive' } }
    })
    if (!latePayment) return res.status(404).end(`Retarded Payment product not found`)
    //Validar que tan antiguo es el cobro no pagado.
    const latePaymentData = billings
      .map((billing) => {
        const {
          product: { id }
        } = billing
        if (id === monthlyPayment.id && dayjs(billing.updateAt).add(15, 'days') <= dayjs()) {
          const existLatePayment = billings.some((bill) => {
            const differenceBothDates = dayjs(bill.updateAt).diff(dayjs(billing.updateAt))
            const isDateEqual = differenceBothDates === 0
            const isDelayed = bill.product.id === latePayment.id
            return isDateEqual && isDelayed
          })

          // Crearemos un cobro x retardo pendiente.
          if (!existLatePayment)
            return constructBilling(
              latePayment,
              student as Student,
              semester,
              `Retardo de ${billing.productName}`,
              billing.updateAt
            )
        } else {
          return undefined
        }
      })
      .filter((e) => e !== undefined)

    const data = latePaymentData as Prisma.Enumerable<Prisma.BillingCreateManyInput>
    if (latePaymentData.length > 0) await prisma.billing.createMany({ data })

    billings = await prisma.billing.findMany({
      ...billing,
      where: {
        student: { id: { equals: student?.id } },
        isCharged: { equals: false }
      }
    })
    res.status(200).json({ student, billings })
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message)
    }
  }
}

//Función para calcular la duración en MESES de un semestre...
function calculateMonths({ startDate, endDate }: Semester) {
  const monthsOfDifference = dayjs(endDate)
    .subtract(startDate.getDate(), 'days')
    .subtract(startDate.getMonth(), 'months')
    .subtract(startDate.getFullYear(), 'year')
    .month()

  return monthsOfDifference + 1
}

// fabrica de objetos 'Billing'
function constructBilling(
  product: Product,
  student: Student,
  semester: Semester,
  productName: string,
  dateToPay: Date | null
) {
  return {
    amount: product.price,
    productId: product.id,
    productName,
    semesterId: semester.id,
    studentId: student.id,
    updateAt: dateToPay
  }
}

// We have handle the logic from billing to a student, calculate pending semester or months and return this
//Tomamos la cantidad de meses, validamos si son 6 o más.
// tomar el mes de inicio del semestre y restarlo al mes final del semestre.
// Contar desde el mes de inicio hasta el final incluyendo estos dos.
// ¿Se debería añadir un campo booleano al semestre para indicar que está activo?
// EJEMPLO: Semestre 2022-II inicio 5 Septiembre 2022 -> Finaliza el 6 de Enero de 2023 ... Septiembre, Octubre, Noviembre, Diciembre, Enero... + Inscripción (mes anterior al inicio de sem)
// EJEMPLO2: Semestre 2023-II inicio 4 de febrero 2023 -> Finaliza el 9 de Agosto de 2023 ... Febrero, Marzo, Abril, Mayo, Junio, Julio, Agosto... sin Inscripción ? (hay 7 meses)
// Sí se tienen menos de 5 meses, se adicionará la inscripción, en caso contrario (hay 6 o más meses) solo se cobrarán las mensualidades.
// NO hago nada si el estudiante es distinto a "Matriculado" id: 1
// Si reviso la lista de cobros del estudiante:
// Tiene cobros en false o NO tiene
// Y estos NO son del semestre actual
// Se generan los cobros del semestre actual
// const existThisSemester = billings.some((billing) => billing.semester.id === semester?.id)
// No existen cobros de este semestre. Generamos los cobros pertinentes
// Obtenemos el arreglo de las mensualidades por cobrar...
// *no puede pagar semestre actual si no ha pagado anteriores*
// Si reviso la lista de cobros, tiene cobros y estos son del semestre actual, no realizo ninguna creación y devuelvo todos los que estén en false
// Tenemos cobros por realizar. Puede que sean del semestre pasado.
