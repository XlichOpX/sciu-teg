import { faker } from '@faker-js/faker'
import { Prisma, PrismaClient } from '@prisma/client'
import { encrypt } from '../lib/crypter'

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
  genCategory('Matrícula', ['Derecho de Inscripción', 'Reingreso', 'Mensualidad']),
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
const totalOcupations = 30
const totalStudents = 100
const totalClients = 100
const totalConversions = 10
const receiptsPerPerson = 5
const productsPerReceipt = 6
const chargesPerReceipt = 3

async function main() {
  await createCurrenciesAndPaymentMethods()
  await createDocTypes()
  await createOccupations()
  await createCareers()
  await createStudentStatus()

  const docTypeIds = (await prisma.docType.findMany()).map((d) => d.id)
  await createStudents(docTypeIds)
  await createClients(docTypeIds)

  await createCategoriesAndProducts()
  await createConversions()
  await createReceipts()

  await createDummyUser(docTypeIds)
  await createParameters()
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

async function createDummyUser(docTypeIds: number[]) {
  await prisma.user.create({
    data: {
      username: 'admin',
      password: encrypt('password')[1],
      person: {
        create: genPerson(docTypeIds)
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
      }
    }
  })
}

async function createReceipts() {
  const persons = await prisma.person.findMany()
  const products = await prisma.product.findMany()
  const paymentMethodIds = (await prisma.paymentMethod.findMany()).map((pm) => pm.id)
  const conversionIds = (await prisma.conversion.findMany()).map((c) => c.id)

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

          const charges = Array.from({ length: totalCharges }).map(() => ({
            amount: totalAmount / totalCharges,
            paymentMethodId: getRandomValueFromArray(paymentMethodIds),
            date: faker.date.recent(),
            conversionId: getRandomValueFromArray(conversionIds)
          }))

          return prisma.receipt.create({
            data: {
              personId: p.id,
              chargedProducts: {
                createMany: {
                  data: chargedProducts
                }
              },
              charges: {
                createMany: {
                  data: charges
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

async function createConversions() {
  await prisma.conversion.createMany({
    data: Array.from({ length: totalConversions }).map(() => ({
      dolar: faker.datatype.number({ min: 6, max: 9, precision: 0.0001 }),
      euro: faker.datatype.number({ min: 6, max: 9, precision: 0.0001 })
    }))
  })
}

async function createCategoriesAndProducts() {
  return await Promise.all(CATEGORIES.map((data) => prisma.category.create({ data })))
}

async function createClients(docTypeIds: number[]) {
  const occupationIds = (await prisma.occupation.findMany()).map((o) => o.id)
  return await Promise.all(
    Array.from({ length: totalClients })
      .map(() => ({
        person: {
          create: genPerson(docTypeIds)
        },
        occupation: { connect: { id: getRandomValueFromArray(occupationIds) } }
      }))
      .map((data) => prisma.client.create({ data }))
  )
}

async function createStudents(docTypeIds: number[]) {
  const careerIds = (await prisma.career.findMany()).map((c) => c.id)
  const statusIds = (await prisma.studentStatus.findMany()).map((s) => s.id)
  return await Promise.all(
    Array.from({ length: totalStudents })
      .map(() => ({
        person: {
          create: genPerson(docTypeIds)
        },
        currentSemester: getRandomInt({ max: 6 }),
        career: { connect: { id: getRandomValueFromArray(careerIds) } },
        status: { connect: { id: getRandomValueFromArray(statusIds) } }
      }))
      .map((data) => prisma.student.create({ data }))
  )
}

async function createStudentStatus() {
  return await prisma.studentStatus.createMany({
    data: STUDENT_STATUS.map((status) => ({
      status,
      description: status
    }))
  })
}

async function createCareers() {
  return await prisma.career.createMany({ data: CAREERS.map((career) => ({ career })) })
}

async function createOccupations() {
  return await prisma.occupation.createMany({
    data: Array.from({ length: totalOcupations }).map(() => ({
      ocupation: faker.name.jobTitle()
    }))
  })
}

async function createDocTypes() {
  return await prisma.docType.createMany({
    data: DOCUMENT_TYPES.map((type) => ({ type }))
  })
}

async function createCurrenciesAndPaymentMethods() {
  return await Promise.all(
    CURRENCIES.map((c) =>
      prisma.currency.create({
        data: {
          name: c.name,
          symbol: c.symbol,
          paymentMethods: {
            createMany: {
              data: PAYMENT_METHODS.map((pm) => ({
                name: pm,
                description: faker.lorem.sentence(3)
              }))
            }
          }
        }
      })
    )
  )
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

function getRandomValueFromArray(array: any[]) {
  return array[getRandomInt({ min: 0, max: array.length - 1 })]
}
