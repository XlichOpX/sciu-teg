import { Prisma } from '@prisma/client'

export const productWithCategory = Prisma.validator<Prisma.ProductArgs>()({
  select: {
    id: true,
    name: true,
    stock: true,
    price: true,
    categoryId: true,
    category: { select: { name: true } }
  }
})

export const receiptWithPerson = Prisma.validator<Prisma.ReceiptArgs>()({
  select: {
    amount: true,
    createdAt: true,
    id: true,
    person: {
      select: {
        docType: { select: { type: true } },
        docNumber: true,
        firstName: true,
        firstLastName: true
      }
    }
  }
})

export const chargeWithPaymentMethodAndConversion = Prisma.validator<Prisma.ChargeArgs>()({
  include: { paymentMethod: true, conversion: { select: { euro: true, dolar: true } } }
})

export const clientWithPersonAndOccupation = Prisma.validator<Prisma.ClientArgs>()({
  include: { person: true, occupation: true }
})

export const paymentMethodWithConversion = Prisma.validator<Prisma.PaymentMethodArgs>()({
  include: { currency: { select: { name: true, symbol: true } } }
})

export const personWithAllData = Prisma.validator<Prisma.PersonArgs>()({
  include: {
    address: true,
    client: true,
    docType: true,
    receipts: false,
    student: true,
    user: true
  }
})

export const receiptWithAll = Prisma.validator<Prisma.ReceiptArgs>()({
  select: {
    amount: true,
    chargedProducts: {
      select: {
        id: true,
        price: true,
        billing: { select: { isCharged: true, productName: true } },
        product: { select: { name: true } },
        quantity: true
      }
    },
    charges: {
      select: {
        amount: true,
        conversion: { select: { dolar: true, euro: true } },
        id: true,
        paymentMethod: {
          select: {
            currency: { select: { name: true, symbol: true } },
            name: true,
            id: true
          }
        }
      }
    },
    createdAt: true,
    id: true,
    person: {
      select: {
        address: { select: { shortAddress: true } },
        docNumber: true,
        docType: { select: { type: true } },
        firstLastName: true,
        firstName: true,
        middleName: true,
        secondLastName: true
      }
    }
  }
})

export const studentWithPersonStatusCareerAndEnrolledSemesters =
  Prisma.validator<Prisma.StudentArgs>()({
    include: { person: true, status: true, career: true, enrolledSemesters: true }
  })

export const studentWithPersonCareerAndStatus = Prisma.validator<Prisma.StudentArgs>()({
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
  }
})

export const billing = Prisma.validator<Prisma.BillingArgs>()({
  select: {
    id: true,
    isCharged: true,
    product: true,
    productName: true,
    amount: true,
    semester: true,
    createAt: true,
    updateAt: true
  }
})

export const userEssencials = Prisma.validator<Prisma.UserArgs>()({
  select: { id: true, status: true, username: true }
})

export const roleWithPermissions = Prisma.validator<Prisma.RoleArgs>()({
  include: { permissions: true }
})

export const personListing = Prisma.validator<Prisma.PersonArgs>()({
  select: {
    id: true,
    cellphone: true,
    firstName: true,
    firstLastName: true,
    middleName: true,
    secondLastName: true,
    student: { select: { id: true } },
    client: { select: { id: true } },
    docNumber: true,
    docType: { select: { type: true } },
    email: true,
    address: { select: { shortAddress: true } }
  }
})

export const userWithAll = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    person: true,
    roles: { include: { permissions: true } },
    secret: true,
    status: true,
    username: true
  }
})
