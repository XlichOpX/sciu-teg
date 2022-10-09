import { Prisma, Product, Semester, Student } from '@prisma/client'
import prisma from '../../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import dayjs from 'lib/dayjs'
// Validate typeof id
const idValidation = z.string().min(1).max(12)
//Función para calcular la duración en MESES de un semestre...
const calculateMonths = ({ startDate, endDate }: Semester) => {
  const monthsOfDifference = dayjs(endDate)
    .subtract(startDate.getDate(), 'days')
    .subtract(startDate.getMonth(), 'months')
    .subtract(startDate.getFullYear(), 'year')
    .month()

  return monthsOfDifference + 1
}
// fabrica de objetos 'Billing'
const constructBilling = (
  product: Product,
  student: Student,
  semester: Semester,
  productName: string
) => ({
  amount: product.price,
  productId: product.id,
  productName,
  semesterId: semester.id,
  studentId: student.id
})

// We have handle the logic from billing to a student, calculate pending semester or months and return this
export default async function billingHandle(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
    query: { id: docNum }
  } = req

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  const { success } = idValidation.safeParse(docNum)
  if (!success) return res.status(404).send(`Document Number ${docNum} Not Allowed`)

  // buscamos a la persona, su estatus y última recibo generado.
  //Obtenemos al estudiante y todos sus datos a partir de la cédula
  const student = await prisma.student.findFirst({
    include: {
      person: {
        select: {
          firstName: true,
          firstLastName: true,
          secondLastName: true,
          docNumber: true,
          middleName: true,
          address: { select: { shortAddress: true } },
          regDate: true
        }
      },
      career: { select: { career: true } },
      status: { select: { id: true, status: true } }
    },
    where: { person: { docNumber: Array.isArray(docNum) ? docNum[0] : docNum } }
  })
  // Obtenemos el semestre actual
  const semester = await prisma.semester.findFirst({ orderBy: { endDate: 'desc' } })

  //Hacemos una query y contamos si existen
  const billingCount = await prisma.billing.count({
    where: {
      student: { id: { equals: student?.id } },
      semesterId: { equals: semester?.id }
    }
  })

  console.log({ billingCount })
  
  // Generamos los productos correspondiente al semestre
  const createBilling = async () => {
    const monthsOfSemester = semester ? calculateMonths(semester) : 0
    const monthlyPayment = await prisma.product.findFirst({
      where: { name: { contains: 'Mensualidad', mode: 'insensitive' } }
    })
    const inscription = await prisma.product.findFirst({
      where: { name: { contains: 'Inscripción', mode: 'insensitive' } }
    })
    const data: Prisma.Enumerable<Prisma.BillingCreateManyInput> = []
    for (let i = 0; i <= monthsOfSemester; i++) {
      const newMonth = dayjs(semester?.startDate).locale('es').add(i, 'month').format('MMMM')
      const productName = `Mensualidad de ${newMonth}`

      if (monthlyPayment && semester)
        data.push(constructBilling(monthlyPayment, student as Student, semester, productName))
    }
    //Tomamos la cantidad de meses, validamos si son 6 o más.
    if (monthsOfSemester <= 5 && semester && inscription)
      data.push(
        constructBilling(
          inscription,
          student as Student,
          semester,
          `Inscripción del semestre ${semester?.semester}`
        )
      )

    return await prisma.billing.createMany({ data })
  }


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

  if (billingCount === 0) await createBilling()
  // No existen cobros de este semestre. Generamos los cobros pertinentes

  // Obtenemos el arreglo de las mensualidades por cobrar...
  const billings = await prisma.billing.findMany({
    select: {
      id: true,
      isCharged: true,
      product: true,
      productName: true,
      amount: true,
      semester: true,
      createAt: true
    },
    where: {
      student: { id: { equals: student?.id } },
      isCharged: { equals: false }
    }
  })
  // *no puede pagar semestre actual si no ha pagado anteriores*
  // Si reviso la lista de cobros, tiene cobros y estos son del semestre actual, no realizo ninguna creación y devuelvo todos los que estén en false

  // Tenemos cobros por realizar. Puede que sean del semestre pasado.

  res.status(200).json({ student, billings })
}
