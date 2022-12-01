import { Category, Currency, PaymentMethod } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import dayjs from 'lib/dayjs'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import _ from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextApiRequestQuery } from 'next/dist/server/api-utils'
import { CategoryReport, PaymentMethodReport, ProductReport } from 'types/report'
import { canUserDo } from 'utils/checkPermissions'
export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method, session, query } = req
  if (!(method === 'GET')) return res.json({ error: 'method not allowed' })
  if (!(await canUserDo(session, 'READ_REPORT'))) return res.status(403).send(`Can't read this.`)

  const { report } = query
  // queryString like: reports?report=arqByPayMethod&start=MM/DD/YYYY&end=MM/DD/YYYY&paymentMethod=ID&paymentMethod=ID2...
  try {
    const { endDate, startDate } = intervalDates(query)
    const { paymentMethod, category } = query
    const categoryArr: number[] = await setCategories(category)
    const paymentMethodArr: number[] = await setPaymentMethod(paymentMethod)
    let baseReport: basicReport[]

    switch (report) {
      case 'arqByTotalProducts':
        const productSale = await prisma.productSale.findMany({
          select: {
            createdAt: true,
            price: true,
            product: {
              select: { id: true, name: true, category: { select: { id: true, name: true } } }
            },
            quantity: true
          },
          where: {
            AND: [
              { createdAt: { gte: startDate, lte: endDate } },
              {
                product: { categoryId: { in: categoryArr } }
              }
            ]
          }
        })
        const byProducts: ProductReport[] = []
        productSale.forEach((sale) => {
          const { price, product, createdAt, quantity } = sale
          const { name, id, category } = product
          const findI = byProducts.findIndex((sale) => sale.id === id)
          if (findI !== -1) {
            byProducts[findI].amount += price
            byProducts[findI].quantity += quantity ?? 1
          } else {
            byProducts.push({
              id,
              name,
              category,
              amount: price,
              createdAt,
              quantity: quantity ?? 1
            })
          }
        })
        res.json(byProducts)
        break
      case 'arqByPayMethod':
        const byPayment: PaymentMethodReport[] = []

        baseReport = await generateBasicReport({ paymentMethodArr, endDate, startDate })

        baseReport.forEach((charge) => {
          const { amount, currency, paymentMethod, createdAt } = charge
          if (!paymentMethodArr.includes(paymentMethod.id)) return
          const index = byPayment.findIndex(
            (charge) => charge.id === paymentMethod.id && charge.currency.id === currency.id
          )
          if (index !== -1) byPayment[index].amount += amount
          else
            byPayment.push({
              amount,
              paymentMethod: paymentMethod.name,
              id: paymentMethod.id,
              currency,
              createdAt
            })
        })

        res.json(_.groupBy(byPayment, 'paymentMethod'))
        break

      case 'arqByCategory':
        const byCategory: CategoryReport[] = []

        baseReport = await generateBasicReport({ categoryArr, endDate, startDate })

        baseReport.forEach((charge) => {
          const { amount, currency, category } = charge
          category.forEach((cat) => {
            if (!categoryArr.includes(cat.id)) return
            const index = byCategory.findIndex(
              (charge) => charge.id === cat.id && charge.currency.id === currency.id
            )
            if (index !== -1) byCategory[index].amount += amount
            else
              byCategory.push({
                amount,
                category: cat.name,
                id: cat.id,
                currency
              })
          })
        })

        res.json(_.groupBy(byCategory, 'category'))

        break

      default:
        res.json({ error: `not report found` })
        break
    }
  } catch (error) {
    res.json({ error })
  }
}

type basicReport = {
  amount: number
  id: number
  currency: Omit<Currency, 'createdAt' | 'updatedAt'>
  paymentMethod: Pick<PaymentMethod, 'id' | 'name'>
  category: (Pick<Category, 'id' | 'name'> & { price: number })[]
  createdAt: Date
}

async function generateBasicReport({
  categoryArr,
  paymentMethodArr,
  startDate,
  endDate
}: {
  categoryArr?: number[]
  paymentMethodArr?: number[]
  startDate?: Date
  endDate?: Date
}) {
  const basicReport = await prisma.charge.findMany({
    select: {
      id: true,
      paymentMethod: { select: { id: true, name: true } },
      amount: true,
      currency: { select: { id: true, name: true, symbol: true } },
      receipt: {
        select: {
          chargedProducts: {
            select: {
              product: { select: { category: { select: { id: true, name: true } } } },
              price: true
            }
          }
        }
      },
      createdAt: true
    },
    where: {
      AND: [
        { createdAt: { gte: startDate, lte: endDate } },
        {
          receipt: {
            chargedProducts: { some: { product: { categoryId: { in: categoryArr } } } }
          }
        },
        { paymentMethodId: { in: paymentMethodArr } }
      ]
    },
    orderBy: {
      amount: 'desc'
    }
  })

  return basicReport.map((charge) => {
    const { paymentMethod, receipt, id, currency, amount, createdAt } = charge
    const { chargedProducts } = receipt
    const category = chargedProducts.map((charProd) => {
      const {
        price,
        product: { category }
      } = charProd
      return { price, ...category }
    })

    return {
      amount,
      id,
      currency,
      paymentMethod,
      category,
      createdAt
    }
  })
}

function intervalDates({ start, end }: NextApiRequestQuery) {
  const startDate: string | undefined = Array.isArray(start) ? start[0] : start
  const endDate: string | undefined = Array.isArray(end) ? end[0] : end
  return {
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate
      ? dayjs(endDate).set('h', 23).set('m', 59).set('s', 59).set('ms', 999).toDate()
      : undefined
  }
}

async function setCategories(category: string[] | string | undefined) {
  if (category) {
    return Array.isArray(category) ? category.map((e) => Number(e)) : [Number(category)]
  } else {
    const categories = await prisma.category.findMany({ select: { id: true } })
    return categories.map((cat) => cat.id)
  }
}

async function setPaymentMethod(paymentMethod: string[] | string | undefined) {
  if (paymentMethod) {
    return Array.isArray(paymentMethod)
      ? paymentMethod.map((e) => Number(e))
      : [Number(paymentMethod)]
  } else {
    const paymentMethod = await prisma.paymentMethod.findMany({ select: { id: true } })
    return paymentMethod.map((pm) => pm.id)
  }
}
