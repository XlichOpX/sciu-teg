import { faker } from '@faker-js/faker'
import { Prisma, PrismaClient } from '@prisma/client'
import { encryptToSaveDB } from '../lib/crypter'
import {
  CAREERS,
  CATEGORIES,
  CURRENCIES,
  DOCUMENT_TYPES,
  PAYMENT_METHODS,
  SECRET_QUESTIONS,
  STUDENT_STATUS
} from './baseData'
import { permissions } from './permissions'

const tables = Prisma.dmmf.datamodel.models.map((model) => `"${model.name}"`).join(', ')

faker.setLocale('es')
const prisma = new PrismaClient()

// Parámetros para manejar la cantidad de datos a generar
const totalOccupations = 5
const totalStudents = 10
const totalClients = 5
const receiptsPerPerson = 2
const productsPerReceipt = 2
const chargesPerReceipt = 1

async function main() {
  await prisma.$executeRawUnsafe(`TRUNCATE ${tables} RESTART IDENTITY CASCADE;`)

  const docTypeIDs = await createDocTypes()
  const statusIDs = await createStudentStatus()
  const careerIDs = await createCareers()
  await createStudents({ docTypeIDs, careerIDs, statusIDs })

  const occupationIDs = await createOccupations()
  await createClients({ docTypeIDs, occupationIDs })

  await createCategoriesAndProducts()

  const currenciesIDs = await createCurrencies()
  const paymentMethodsIDs = await createPaymentMethods()
  await createReceipts({ currenciesIDs, paymentMethodsIDs })

  await createParameters()
  await createSemester()

  const permissionIDs = await createPermissions()
  await createDummyUser(permissionIDs)

  await createSecretQuestions()
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

async function createSecretQuestions() {
  await prisma.secretQuestion.createMany({
    data: SECRET_QUESTIONS.map((e) => ({ question: e }))
  })
}

async function createPermissions() {
  await prisma.permission.createMany({
    data: permissions
  })
  return (await prisma.permission.findMany({ select: { id: true } })).map((p) => p.id)
}

async function createSemester() {
  await prisma.semester.create({
    data: {
      startDate: new Date('2022-03-02T00:00-04:00'),
      endDate: new Date('2022-09-02T00:00-04:00'),
      semester: '2022-II'
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

async function createDummyUser(permissionIDs: number[]) {
  await prisma.user.create({
    data: {
      username: 'admin',
      password: encryptToSaveDB('password'),
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
          answerOne: encryptToSaveDB('chao'),
          questionTwo: 'hola',
          answerTwo: encryptToSaveDB('chao'),
          questionThree: 'hola',
          answerThree: encryptToSaveDB('chao')
        }
      },
      roles: {
        create: {
          name: 'Administrador',
          description: 'Usuario principal del sistema',
          permissions: { connect: permissionIDs.map((p) => ({ id: p })) }
        }
      }
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

async function createCategoriesAndProducts() {
  return await Promise.all(
    CATEGORIES.map((data) =>
      prisma.category.create({
        data: {
          name: data.name,
          description: faker.lorem.sentence(3),
          products: {
            createMany: {
              data: data.products.map((p) => ({
                name: p.name,
                stock: faker.datatype.number({ min: -1, max: 100 }),
                price: faker.datatype.number({ min: 0.1, max: 30, precision: 0.01 })
              }))
            }
          }
        }
      })
    )
  )
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
      description: faker.lorem.sentence(3)
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
      occupation: faker.lorem.words(2)
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
async function createPaymentMethods() {
  await Promise.all(
    PAYMENT_METHODS.map((pm) =>
      prisma.paymentMethod.create({
        data: {
          name: pm.name,
          description: pm.description,
          currencies: { connect: pm.currencies.map((c) => ({ name: c })) },
          metaPayment: pm.metaPayment
        }
      })
    )
  )
  return (await prisma.paymentMethod.findMany({ select: { id: true } })).map((pm) => pm.id)
}

async function createCurrencies() {
  await Promise.all(
    CURRENCIES.map((c) =>
      prisma.currency.create({
        data: {
          name: c.name,
          symbol: c.symbol,
          conversions: {
            create: {
              value: c.conversion,
              date: faker.date.recent(3)
            }
          }
        }
      })
    )
  )
  return (await prisma.currency.findMany({ select: { id: true } })).map((c) => c.id)
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

function getRandomInt({ min = 1, max }: { min?: number; max: number }) {
  return faker.datatype.number({ min, max, precision: 1 })
}

function getRandomValueFromArray<T>(array: T[]) {
  return array[getRandomInt({ min: 0, max: array.length - 1 })]
}
