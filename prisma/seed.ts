import { faker } from '@faker-js/faker'
import { Prisma, PrismaClient } from '@prisma/client'
import { encrypt } from '../lib/crypter'
import { permissionsMoca } from './permissions'

faker.setLocale('es')

const prisma = new PrismaClient()

const CAREERS = [
  'Informática',
  'Contabilidad',
  'Administración',
  'Electrotecnia',
  'Electrónica',
  'Educación'
]

const DOCUMENT_TYPES = ['CV', 'CE', 'PP', 'RIF']

const STUDENT_STATUS = ['Matriculado', 'Egresado', 'Retirado']

const CURRENCIES = [
  { name: 'Bolívar', symbol: 'Bs' },
  { name: 'Euro', symbol: '€' },
  { name: 'Dólar', symbol: '$' }
]

const PAYMENT_METHODS = ['Tarjeta', 'Transferencia', 'Efectivo', 'Pago móvil']

const CATEGORIES = [
  genCategory('Tramitación de títulos', ['Fondo Negro Título', 'Petición de Grado']),
  genCategory('Matrícula', [
    'Derecho de Inscripción',
    'Reingreso',
    'Mensualidad',
    'Recargo por Retardo'
  ]),
  genCategory('Derecho a Grado', [
    'Solicitud de Acto de Grado por Secretaria',
    'Paquete constancias graduandos',
    'Permiso Acto de Grado'
  ]),
  genCategory('Procesos estudiantiles', [
    'Cambio de carrera',
    'Equivalencia Internas Entre Carrera'
  ]),
  genCategory('Constancias', [
    'Constancia de Inscripción',
    'Constancia de Buena Conducta',
    'Constancia de Estudio'
  ])
]

// Parámetros para manejar la cantidad de datos a generar
const totalOccupations = 5
const totalStudents = 5
const totalClients = 5
const totalConversions = 4
const receiptsPerPerson = 2
const productsPerReceipt = 2
const chargesPerReceipt = 1

async function main() {
  const currenciesIDs = await createCurrencies()
  const paymentMethodsIDs = await createPaymentMethods({ currenciesIDs })
  await createConversions({ currenciesIDs })
  const docTypeIDs = await createDocTypes()

  const occupationIDs = await createOccupations()
  const careerIDs = await createCareers()
  const statusIDs = await createStudentStatus()

  await createStudents({ docTypeIDs, careerIDs, statusIDs })
  await createClients({ docTypeIDs, occupationIDs })

  await createCategoriesAndProducts()
  await createReceipts({ currenciesIDs, paymentMethodsIDs })

  const permissionIDs = await createPermissions()
  await createRoles({ permissionIDs })
  await createParameters()

  await createSemester()

  await createDummyUser()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

async function createPermissions() {
  await prisma.permission.createMany({
    data: permissionsMoca
  })
  return (await prisma.permission.findMany({ select: { id: true } })).map((p) => p.id)
}

async function createSemester() {
  await prisma.semester.create({
    data: {
      startDate: new Date('2022-02-04T00:00-04:00'),
      endDate: new Date('2022-08-04T00:00-04:00'),
      semester: '2022-I'
    }
  })
}

async function createParameters() {
  await prisma.parameters.create({
    data: {
      institute: 'Instituto Universitario X',
      address: `${faker.address.city()}, ${faker.address.street()}`,
      phone: faker.phone.number('04## #### ###'),
      population: faker.address.cityName(),
      rif: `J-${faker.random.numeric(9)}`
    }
  })
}

async function createDummyUser() {
  await prisma.user.create({
    data: {
      username: 'admin',
      password: encrypt('password')[1],
      person: {
        connect: { id: 1 }
      },
      status: {
        create: {
          status: 'Activo',
          description: 'El usuario está activo'
        }
      },
      secret: {
        create: {
          questionOne: 'hola',
          answerOne: 'chao',
          questionTwo: 'hola',
          answerTwo: 'chao',
          questionThree: 'hola',
          answerThree: 'chao'
        }
      },
      roles: { connect: { id: 1 } }
    }
  })
}

async function createReceipts({
  currenciesIDs,
  paymentMethodsIDs
}: {
  currenciesIDs: number[]
  paymentMethodsIDs: number[]
}) {
  const persons = await prisma.person.findMany()
  const products = await prisma.product.findMany()

  const receipts = Promise.all(
    persons
      .map((p) => {
        const receiptPromises = Array.from({ length: receiptsPerPerson }).map(() => createReceipt())
        return receiptPromises

        function createReceipt() {
          const chargedProducts = Array.from({
            length: getRandomInt({ max: productsPerReceipt })
          }).map(() => {
            const product = getRandomValueFromArray(products)
            return {
              productId: product.id,
              price: product.price,
              quantity: getRandomInt({ max: 6 })
            }
          })
          const totalAmount = chargedProducts.reduce((ac, p) => ac + p.price * p.quantity, 0)
          const totalCharges = getRandomInt({ max: chargesPerReceipt })

          return prisma.receipt.create({
            data: {
              amount: totalAmount,
              personId: p.id,
              chargedProducts: {
                createMany: {
                  data: chargedProducts
                }
              },
              charges: {
                createMany: {
                  data: Array.from({ length: totalCharges }).map(() => ({
                    amount: totalAmount / totalCharges,
                    paymentMethodId: getRandomValueFromArray(paymentMethodsIDs),
                    createdAt: faker.date.recent(),
                    currencyId: getRandomValueFromArray(currenciesIDs)
                  }))
                }
              }
            }
          })
        }
      })
      .flat()
  )

  return receipts
}

async function createConversions({ currenciesIDs }: { currenciesIDs: number[] }) {
  await prisma.conversion.createMany({
    data: Array.from({ length: totalConversions }).map(() => ({
      value: faker.datatype.number({ min: 0, max: 10, precision: 0.0001 }),
      currencyId: getRandomValueFromArray(currenciesIDs)
    }))
  })
}

async function createCategoriesAndProducts() {
  return await Promise.all(CATEGORIES.map((data) => prisma.category.create({ data })))
}

async function createClients({
  docTypeIDs,
  occupationIDs
}: {
  docTypeIDs: number[]
  occupationIDs: number[]
}) {
  return await Promise.all(
    Array.from({ length: totalClients })
      .map(() => ({
        person: {
          create: genPerson(docTypeIDs)
        },
        occupation: { connect: { id: getRandomValueFromArray(occupationIDs) } }
      }))
      .map((data) => prisma.client.create({ data }))
  )
}

async function createStudents({
  docTypeIDs,
  careerIDs,
  statusIDs
}: {
  docTypeIDs: number[]
  careerIDs: number[]
  statusIDs: number[]
}) {
  return await Promise.all(
    Array.from({ length: totalStudents })
      .map(() => ({
        person: {
          create: genPerson(docTypeIDs)
        },
        currentSemester: getRandomInt({ max: 6 }),
        career: { connect: { id: getRandomValueFromArray(careerIDs) } },
        status: { connect: { id: getRandomValueFromArray(statusIDs) } }
      }))
      .map((data) => prisma.student.create({ data }))
  )
}

async function createStudentStatus() {
  await prisma.studentStatus.createMany({
    data: STUDENT_STATUS.map((status) => ({
      status,
      description: status
    }))
  })
  return (await prisma.studentStatus.findMany({ select: { id: true } })).map((ss) => ss.id)
}

async function createCareers() {
  await prisma.career.createMany({ data: CAREERS.map((career) => ({ career })) })
  return (await prisma.career.findMany({ select: { id: true } })).map((c) => c.id)
}

async function createOccupations() {
  await prisma.occupation.createMany({
    data: Array.from({ length: totalOccupations }).map(() => ({
      occupation: faker.name.jobTitle()
    }))
  })
  return (await prisma.occupation.findMany({ select: { id: true } })).map((o) => o.id)
}

async function createDocTypes() {
  await prisma.docType.createMany({
    data: DOCUMENT_TYPES.map((type) => ({ type }))
  })
  return (await prisma.docType.findMany({ select: { id: true } })).map((dt) => dt.id)
}
async function createPaymentMethods({ currenciesIDs }: { currenciesIDs: number[] }) {
  return (
    await Promise.all(
      PAYMENT_METHODS.map(async (pm) => {
        return await prisma.paymentMethod.create({
          data: {
            name: pm,
            description: pm,
            currencies: { connect: currenciesIDs.map((c) => ({ id: c })) }
          },
          select: { id: true }
        })
      })
    )
  ).map((pm) => pm.id)
}

async function createCurrencies() {
  await prisma.currency.createMany({
    data: CURRENCIES
  })
  return (await prisma.currency.findMany({ select: { id: true } })).map((c) => c.id)
}

async function createRoles({ permissionIDs }: { permissionIDs: number[] }) {
  await prisma.role.create({
    data: {
      name: 'adm',
      description: 'Dios',
      permissions: { connect: permissionIDs.map((p) => ({ id: p })) }
    }
  })

  await prisma.role.createMany({
    data: Array.from({ length: 6 }).map(() => ({
      name: faker.name.jobType(),
      description: faker.lorem.sentence(4)
    }))
  })
}

function genPerson(docTypeIds: number[]): Prisma.PersonCreateInput {
  return {
    docNumber: faker.random.numeric(9),
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    firstLastName: faker.name.lastName(),
    landline: faker.phone.number('+58 04## #### ###'),
    cellphone: faker.phone.number('+58 04## #### ###'),
    address: {
      create: {
        shortAddress: [faker.address.city(), faker.address.streetAddress()].join(', ')
      }
    },
    docType: { connect: { id: getRandomValueFromArray(docTypeIds) } }
  }
}

function genProduct(name: string) {
  return {
    name,
    price: Number(faker.commerce.price(1, 30)),
    stock: faker.datatype.number(100)
  }
}

function genCategory(name: string, products: string[]): Prisma.CategoryCreateInput {
  return {
    name,
    description: faker.lorem.sentence(),
    products: { createMany: { data: products.map((pr) => genProduct(pr)) } }
  }
}

function getRandomInt({ min = 1, max }: { min?: number; max: number }) {
  return faker.datatype.number({ min, max, precision: 1 })
}

function getRandomValueFromArray<T>(array: T[]) {
  return array[getRandomInt({ min: 0, max: array.length - 1 })]
}
