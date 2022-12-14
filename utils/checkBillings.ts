import { Prisma, Product, Semester, Student } from '@prisma/client'
import dayjs from './../lib/dayjs'
import prisma from './../lib/prisma'
import { billing } from './../prisma/queries'
import { BillingComparatorArgs } from './../types/billing'
import { StudentWithPersonCareerAndStatus } from './../types/student'
import { stringSearch } from './../utils/routePaginate'
import { INSCRIPTION, LATE_PAYMENT, MATRICULADO, MONTHLY_PAYMENT } from './constants'

export async function checkBillings(
  student: StudentWithPersonCareerAndStatus,
  options?: Partial<{ onlyNews: boolean }>
) {
  // Recuperamos el usuario asociado al número de documento pasado
  const newBillings: BillingComparatorArgs[] = []
  // Recuperamos el semestre actual
  const today = new Date()
  const semester = await prisma.semester.findFirst({
    where: { AND: [{ startDate: { lte: today } }, { endDate: { gte: today } }] }
  })
  if (!semester) throw new Error(`Current Semester not found`)

  // Recuperamos el producto 'mensualidad' de la base de datos
  const monthlyPayment = await prisma.product.findFirst({
    where: { name: stringSearch(MONTHLY_PAYMENT) }
  })
  if (!monthlyPayment) throw new Error(`Monthly Payment product not found`)

  // Recuperamos el producto 'Inscripción' de la base de datos
  const inscription = await prisma.product.findFirst({
    where: { name: stringSearch(INSCRIPTION) }
  })
  if (!inscription) throw new Error(`Inscription product not found`)

  // Recuperamos el producto 'Recargo por retardo' de la base de datos
  const latePayment = await prisma.product.findFirst({
    where: { name: stringSearch(LATE_PAYMENT) }
  })
  if (!latePayment) throw new Error(`Retarded Payment product not found`)

  // Contamos si existen cobros efectuados en el semestre actual con respecto al estudiante
  const billingCount = await prisma.billing.count({
    where: {
      student: { id: { equals: student.id } },
      semesterId: { equals: semester.id }
    }
  })

  // Calculamos la cantidad de meses que tiene el semestre actual
  const monthsOfSemester = calculateMonths(semester)

  // Sí no existen billings  del semestre actual y el estudiante está matriculado
  // Generamos los productos correspondiente al semestre (Todas las mensualidades para el semestre actual)
  if (billingCount === 0 && student.status.status === MATRICULADO) {
    const data: Prisma.Enumerable<Prisma.BillingCreateManyInput> = []
    const dateToPay = dayjs(semester.startDate).locale('es').set('date', 1) // semester.startDate == 10/2/2022 ==> 1/2/2022

    // Iteramos los meses del semestre y creamos los objetos pertinentes de 'cobro'
    for (let i = 0; i < monthsOfSemester; i++) {
      const newMonth = dayjs(semester.startDate).locale('es').add(i, 'month').format('MMMM')
      const productName = `Mensualidad de ${newMonth} ${semester.semester}`
      const date = dateToPay.add(i, 'month').toDate() // 1/2/2022 0 1 2 3 4 5 6
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
          `Inscripción del semestre ${semester.semester}`,
          date
        )
      )
    }

    //Creamos los billings.
    newBillings.push(
      ...(await prisma.$transaction(
        data.map((bill) => prisma.billing.create({ ...billing, data: bill }))
      ))
    )
  }

  // Recuperamos todos los billings posterior a haber creado los pendientes, si lo fueron.
  const billings = await prisma.billing.findMany({
    ...billing,
    where: {
      student: { id: { equals: student.id } }
    }
  })

  //Generamos retardos en función de la vejez del billing y si este no ha sido cobrado.
  const latePaymentData = (
    await Promise.all(
      billings.map(async (bill) => {
        const {
          product: { id },
          dateToPay,
          isCharged
        } = bill

        // Validamos que el "billing" sea una mensualidad, no haya sido cobrada y tenga más de 15 días desde su fecha de pago (primero de cada mes)
        if (isCharged) return
        if (!(id === monthlyPayment.id)) return
        if (!(dayjs(dateToPay).add(15, 'days') <= dayjs())) return

        //Validamos que exista un "billing" para el retardo generado, cobrado o no en la lista de retardos, asociada a la mensualidad que pasara la validación anterior.
        const existLatePayment = billings.some((bill) => {
          //Sí el "bill" es la mensualidad o es el retardo correspondiente a la mensualidad dará 0
          const differenceBothDates = dayjs(bill.dateToPay).diff(dayjs(bill.dateToPay)) === 0
          // Sí el "bill" es el retardo correspondiente devolverá true
          const isDelayed = bill.product.id === latePayment.id

          return differenceBothDates && isDelayed
        })

        // Retornamos un cobro x retardo pendiente. Sí no existe uno ya.
        if (!existLatePayment) {
          return await prisma.billing.create({
            ...billing,
            data: constructBilling(
              latePayment,
              student as Student,
              semester,
              `Retardo de ${bill.productName}`,
              bill.dateToPay
            )
          })
        }
      })
    )
  ).filter((e) => e !== undefined) as BillingComparatorArgs[]

  if (options?.onlyNews) {
    newBillings.push(...latePaymentData)
    return newBillings
  }

  // Recuperamos y devolvemos todos los 'billings' pendientes por pagar
  return await prisma.billing.findMany({
    ...billing,
    where: {
      student: { id: { equals: student.id } },
      isCharged: { equals: false }
    }
  })
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
    dateToPay
  }
}
