import { Prisma, PrismaClient } from '@prisma/client'
import { encryptToSaveDB, hashString } from '../lib/crypter'
import dayjs from '../lib/dayjs'
import {
  ADDRESS,
  CAREERS,
  CATEGORIES,
  CURRENCIES,
  DOCUMENT_TYPES,
  DOMAINS,
  DOT_MAIL,
  FIRST_NAMES,
  LAST_NAMES,
  OCCUPATIONS,
  PAYMENT_METHODS,
  ROLES,
  SECRET_QUESTIONS,
  SEMESTERS,
  STUDENT_STATUS
} from './baseData'
import { permissions } from './permissions'

const prisma = new PrismaClient()

// Parámetros para manejar la cantidad de datos a generar
const totalStudents = 1500
const totalClients = 350
const receiptsPerPerson = 35
const productsPerReceipt = 3
const chargesPerReceipt = 2
const receiptSlackDays = 3

async function main() {
  console.time('🌻 Sembrador finalizado. ✔')
  console.log('▶ Iniciando Seeder....')
  await clearTables()
  console.log('🗄 Generando Datos....')

  const careerIDs = await createCareers(CAREERS)
  const currenciesIDs = await createCurrencies(CURRENCIES)
  const docTypes = await createDocTypes(DOCUMENT_TYPES)
  const occupationIDs = await createOccupations(OCCUPATIONS)
  const paymentMethodsIDs = await createPaymentMethods(PAYMENT_METHODS)
  const permissionIDs = await createPermissions(permissions)
  const statusIDs = await createStudentStatus(STUDENT_STATUS)
  await createAddress(ADDRESS)

  await createCategoriesWithProducts(CATEGORIES)
  await createSecretQuestions(SECRET_QUESTIONS)
  await createSemester(SEMESTERS)
  await createParameters()

  await createAdmin(permissionIDs, docTypes)
  await createStudents({ docTypes, careerIDs, statusIDs }, totalStudents)
  await createUsers({ roles: ROLES, docTypes })
  await createClients({ docTypes, occupationIDs }, totalClients)
  await createReceipts({ currenciesIDs, paymentMethodsIDs }, receiptsPerPerson, productsPerReceipt)
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(() => {
    console.timeEnd('🌻 Sembrador finalizado. ✔')
  })
/**
 * Crea recibos en base a los parámetros pasados.
 */
async function createReceipts(
  {
    currenciesIDs,
    paymentMethodsIDs
  }: {
    currenciesIDs: number[]
    paymentMethodsIDs: number[]
  },
  receiptsPerPerson: number,
  productsPerReceipt: number
) {
  const persons = await prisma.person.findMany()
  const products = await prisma.product.findMany()

  const receipts = []
  for (const p of persons) {
    for (let i = 0; i < receiptsPerPerson; i++) {
      receipts.push(await createReceipt())
    }

    function createReceipt() {
      const randomDate = dayjs()
        .subtract(getRandomInt({ max: receiptSlackDays }), 'day')
        .toDate()

      const chargedProducts = Array.from({
        length: getRandomInt({ max: productsPerReceipt })
      }).map(() => {
        const product = getRandomValueFromArray(products)
        return {
          productId: product.id,
          price: product.price,
          quantity: getRandomInt({ max: 6 }),
          createdAt: randomDate
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
                currencyId: getRandomValueFromArray(currenciesIDs),
                createdAt: randomDate
              }))
            }
          },
          createdAt: randomDate
        }
      })
    }
  }

  if (receipts) console.log('🧾 Recibos Creados ✔')
  return receipts
}

/**
 * Crea los productos relacionados a las categorías pasadas, así como estas mismas. Devuelve las Categorías
 * @param categories
 * @returns
 */
async function createCategoriesWithProducts(
  categories: {
    name: string
    description: string
    products: {
      name: string
      stock: number
      price: number
    }[]
  }[]
) {
  const cp = []
  for (const { name, description, products } of categories) {
    cp.push(
      await prisma.category.create({
        data: {
          name,
          description,
          products: {
            createMany: {
              data: products.map(({ name, stock, price }) => ({
                name,
                stock,
                price
              }))
            }
          }
        }
      })
    )
  }

  if (cp) console.log('🛒 Categorías y Productos Creados ✔')
  return cp
}

/**
 * Crea tantos clientes se indiquen por parámetro
 */
async function createClients(
  {
    docTypes,
    occupationIDs
  }: {
    docTypes: {
      id: number
      type: string
    }[]
    occupationIDs: number[]
  },
  totalClients: number
) {
  const c = []
  for (let i = 0; i < totalClients; i++) {
    const person = genPerson(docTypes)
    const id = getRandomValueFromArray(occupationIDs)
    c.push(
      await prisma.client.create({
        data: {
          person: { connectOrCreate: { where: { email: person.email }, create: person } },
          occupation: { connect: { id } }
        }
      })
    )
  }
  if (c) console.log('👤 Clientes Creados ✔')
  return c
}

/**
 * Crea tantos estudiantes se indiquen en totalStudents en parámetro
 * @returns
 */
async function createStudents(
  {
    docTypes,
    careerIDs,
    statusIDs
  }: {
    docTypes: {
      id: number
      type: string
    }[]
    careerIDs: number[]
    statusIDs: number[]
  },
  totalStudents: number
) {
  const s = []
  for (let i = 0; i < totalStudents; i++) {
    s.push(
      await prisma.student.create({
        data: {
          person: {
            create: genPerson(docTypes)
          },
          currentSemester: getRandomInt({ min: 1, max: 6 }),
          career: { connect: { id: getRandomValueFromArray(careerIDs) } },
          status: { connect: { id: getRandomValueFromArray(statusIDs) } }
        }
      })
    )
  }
  if (s) console.log('👨‍🎓 Estudiantes Creados ✔')
  return s
}

/**
 * Genera un objeto correspondiente al PersonCreateInput
 * con datos aleatorios
 */
function genPerson(
  docTypes: {
    id: number
    type: string
  }[]
): Prisma.PersonCreateInput {
  const docType = getRandomValueFromArray(docTypes)
  const firstName = getRandomValueFromArray(FIRST_NAMES)
  const firstLastName = getRandomValueFromArray(LAST_NAMES)
  const middleName = getRandomValueFromArray(FIRST_NAMES)
  const secondLastName = getRandomValueFromArray(LAST_NAMES)
  const email = `${firstName}_${firstLastName}_${hashString(
    `${firstName}_${firstLastName}_${Math.random()}`
  )}@${getRandomValueFromArray(DOMAINS)}.${getRandomValueFromArray(DOT_MAIL)}`
  const shortAddress = getRandomValueFromArray(ADDRESS)
  return {
    docNumber: getRandomDocNumber(docType.type).toString(),
    email,
    firstName,
    firstLastName,
    middleName,
    secondLastName,
    landline: '+' + getRandomInt({ min: 5804000000000, max: 5804269999999 }).toString(),
    cellphone: '+' + getRandomInt({ min: 5804000000000, max: 5804269999999 }).toString(),
    address: {
      connect: {
        shortAddress
      }
    },
    docType: { connect: { id: docType.id } }
  }
}

/**
 * Crea el administrador temporal del sistema
 * @param permissionIDs
 * @param docTypeIDs
 */
async function createAdmin(
  permissionIDs: number[],
  docTypes: {
    id: number
    type: string
  }[]
) {
  const a = await prisma.user.create({
    data: {
      username: 'admin',
      password: encryptToSaveDB('password'),
      person: {
        create: genPerson(docTypes)
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
  if (a) console.log('👨‍💻 Usuario Administrador Creado ✔')
  return a
}

/**
 * Crea los usuarios en base a los Roles pasados
 */
async function createUsers({
  roles,
  docTypes
}: {
  roles: {
    name: string
    description: string
    permissions: string[]
  }[]
  docTypes: {
    id: number
    type: string
  }[]
}) {
  const r = []
  for (const role of roles) {
    r.push(
      await prisma.user.create({
        data: {
          roles: {
            create: {
              ...role,
              permissions: { connect: role.permissions.map((permission) => ({ permission })) }
            }
          },
          username: role.name.toLowerCase(),
          password: encryptToSaveDB('password'),
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
          status: {
            connectOrCreate: {
              create: { status: 'Activo', description: 'El usuario está activo' },
              where: { status: 'Activo' }
            }
          },
          person: { create: genPerson(docTypes) }
        }
      })
    )
  }
  if (r) console.log('👷‍♂️ Usuarios con Rol Creados ✔')
  return r
}

/**
 *  Crea varios semestres pasados y el semestre actual, devolviéndolos en un array de ids.
 * @returns
 */
async function createSemester(semesters: { startDate: Date; endDate: Date; semester: string }[]) {
  const s = []
  for (const semester of semesters) {
    s.push((await prisma.semester.create({ data: semester })).id)
  }
  if (s) console.log('📅 Semestres Creados ✔')
  return s
}

/**
 * Crea los parámetros por defecto para el IUJO.
 * @returns parameters
 */
async function createParameters() {
  const p = await prisma.parameters.create({
    data: {
      institute: 'Instituto Universitario Jesús Obrero',
      address: `Calle Real de los Flores con calle Andrés Bello`,
      phone: '(0212) 861-65-57',
      population: 'Catia - Caracas',
      rif: `J-30576524-3`
    }
  })
  if (p) console.log('⚙ Parámetros Creados ✔')
  return p
}

/**
 * Crea las ocupaciones pasadas y devuelve un arreglo con sus ids
 * @param occupations
 * @returns
 */
async function createOccupations(occupations: string[]) {
  const o = []
  for (const occupation of occupations) {
    o.push((await prisma.occupation.create({ data: { occupation } })).id)
  }
  if (o) console.log('🧰 Ocupaciones de Clientes Creadas ✔')
  return o
}

/**
 * Crea los estados posibles para estudiantes del sistema, devolviendo un arreglo de sus ids
 * @param studentStatus
 * @returns
 */
async function createStudentStatus(studentStatus: { status: string; description: string }[]) {
  const ss = []
  for (const { status, description } of studentStatus) {
    ss.push((await prisma.studentStatus.create({ data: { description, status } })).id)
  }
  if (ss) console.log('📓 Estado Estudiantil Creado ✔')
  return ss
}

/**
 * Crea las carreras pasadas devolviendo un arreglo de sus ids
 * @param careers
 * @returns
 */
async function createCareers(careers: string[]) {
  const c = []
  for (const career of careers) {
    c.push((await prisma.career.create({ data: { career } })).id)
  }
  if (c) console.log('🏁 Carreras universitarias Creadas ✔')
  return c
}

/**
 * Crea los tipos de documentos pasados devolviendo un arreglo de sus ids
 * @param docTypes
 * @returns
 */
async function createDocTypes(docTypes: string[]) {
  const dt = []
  for (const type of docTypes) {
    dt.push(await prisma.docType.create({ select: { id: true, type: true }, data: { type } }))
  }
  if (dt) console.log('🎫 Tipos de Documentos Creados ✔')
  return dt
}

/**
 * Crea los métodos de pago pasados devolviendo un arreglo de sus ids
 * @param paymentMethods
 * @returns
 */
async function createPaymentMethods(
  paymentMethods: {
    name: string
    description: string
    currencies: string[]
    metaPayment?: {
      name: string
      fieldType: string
    }[]
  }[]
) {
  const pm = []
  for (const { name, description, currencies, metaPayment } of paymentMethods) {
    pm.push(
      (
        await prisma.paymentMethod.create({
          select: { id: true },
          data: {
            name,
            description,
            currencies: { connect: currencies.map((c) => ({ name: c })) },
            metaPayment
          }
        })
      ).id
    )
  }
  if (pm) console.log('💱 Métodos de pago Creados ✔')
  return pm
}

/**
 * Crea las Monedas pasadas devolviendo un arreglo de sus ids
 * @param currencies
 */
async function createCurrencies(
  currencies: {
    name: string
    symbol: string
    conversion: {
      value: number
      date: Date
    }[]
  }[]
) {
  const c = []
  for (const ca of currencies) {
    c.push(
      (
        await prisma.currency.create({
          select: { id: true },
          data: {
            name: ca.name,
            symbol: ca.symbol,
            conversions: {
              createMany: {
                skipDuplicates: true,
                data: ca.conversion
              }
            }
          }
        })
      ).id
    )
  }

  if (c) console.log('💰 Monedas Creadas ✔')
  return c
}

/**
 * Crea los permisos pasados devolviendo un arreglo de sus ids
 * @param permissions
 * @returns
 */
async function createPermissions(
  permissions: {
    permission: string
    description: string
  }[]
) {
  const p = []
  for (const permission of permissions) {
    p.push((await prisma.permission.create({ data: permission })).id)
  }
  if (p) console.log('📄 Permisos Creados ✔')
  return p
}

/**
 * Crea las preguntas secretas usable para crear estudiantes devolviendo sus ids
 * @param secretQuestions
 * @returns
 */
async function createSecretQuestions(secretQuestions: string[]) {
  const sq = []
  for (const question of secretQuestions) {
    sq.push((await prisma.secretQuestion.create({ data: { question } })).id)
  }

  if (sq) console.log('🔐 Preguntas secretas Creadas ✔')
  return sq
}

async function createAddress(addresses: string[]) {
  const a = []
  for (const shortAddress of addresses) {
    a.push((await prisma.address.create({ data: { shortAddress } })).id)
  }
  if (a) console.log('🗺  Direcciones Creadas ✔')
  return a
}

/**
 * Devuelve un valor aleatorio entre según el tipo de documento pasado.
 * @param {} { min, max }
 * @returns {number} number
 */
function getRandomDocNumber(type: string) {
  const minMax = {
    CV: { min: 2000000, max: 32999999 },
    CE: { min: 8000000, max: 99999999 },
    PP: { min: 100000000, max: 999999999 },
    RIF: { min: 1000000, max: 99999999 }
  }
  const random = minMax[type as keyof typeof minMax]
  return getRandomInt(random)
}

/**
 * Devuelve un valor aleatorio entre un  mínimo y un máximo
 * por defecto min = 1 y max = 99999
 * @param {} { min, max }
 * @returns {number} number
 */
function getRandomInt({ min = 1, max = 99999 }: { min?: number; max: number }) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Devuelve un valor aleatorio dentro de un arreglo
 * @param array
 * @returns
 */
function getRandomValueFromArray<T>(array: T[]) {
  return array[getRandomInt({ min: 0, max: array.length - 1 })]
}

function clearTables() {
  console.log(`🧨 Eliminando datos de la base de datos...`)
  const tables = Prisma.dmmf.datamodel.models.map((model) => `"${model.name}"`).join(', ')
  return prisma.$executeRawUnsafe(`TRUNCATE ${tables} RESTART IDENTITY CASCADE;`)
}
