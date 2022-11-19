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

export const categoryWithRelationalProducts = Prisma.validator<Prisma.CategoryArgs>()({
  select: {
    _count: true,
    description: true,
    id: true,
    name: true,
    products: {
      select: {
        id: true,
        name: true,
        price: true,
        stock: true
      }
    }
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

export const chargeWithPaymentMethodAndCurrencies = Prisma.validator<Prisma.ChargeArgs>()({
  include: {
    paymentMethod: { select: { currencies: { select: { id: true, symbol: true, name: true } } } }
  }
})

export const clientWithPersonAndOccupation = Prisma.validator<Prisma.ClientArgs>()({
  include: { person: { include: { docType: { select: { type: true } } } }, occupation: true }
})

export const paymentMethodWithCurrencies = Prisma.validator<Prisma.PaymentMethodArgs>()({
  select: {
    createdAt: true,
    currencies: true,
    description: true,
    id: true,
    metaPayment: true,
    name: true,
    updatedAt: true
  }
})

export const paymentMethodWithCurrenciesWithoutDetails =
  Prisma.validator<Prisma.PaymentMethodArgs>()({
    select: {
      currencies: {
        select: {
          id: true,
          name: true,
          symbol: true
        }
      },
      description: true,
      id: true,
      metaPayment: true,
      name: true
    }
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
        currency: { select: { id: true, name: true, symbol: true } },
        id: true,
        paymentMethod: {
          select: {
            currencies: { select: { name: true, symbol: true } },
            name: true,
            id: true
          }
        },
        metaPayment: true
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
        address: { select: { shortAddress: true } },
        docNumber: true,
        firstLastName: true,
        firstName: true,
        id: true,
        middleName: true,
        regDate: true,
        secondLastName: true
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
    dateToPay: true
  }
})

export const userEssentials = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    status: true,
    username: true,
    roles: { select: { id: true, name: true, description: true } }
  }
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

export const reportArqueo = Prisma.validator<Prisma.ChargeArgs>()({})

export const conversionWithCurrency = Prisma.validator<Prisma.ConversionArgs>()({
  select: {
    currency: { select: { id: true, name: true, symbol: true } },
    id: true,
    date: true,
    value: true
  }
})
