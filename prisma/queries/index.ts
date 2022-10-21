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
