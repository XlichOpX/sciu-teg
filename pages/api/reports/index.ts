import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextApiRequestQuery } from 'next/dist/server/api-utils'
import { canUserDo } from 'utils/checkPermissions'

export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method, session, query } = req
  if (!(method === 'GET')) return res.json({ error: 'method not allowed' })
  if (!canUserDo(session, 'READ_REPORT')) return res.status(403).send(`Can't read this.`)

  const { report, paymentMethod, category } = query
  // queryString like: reports?report=arqByPayMethod&start=MM/DD/YYYY&end=MM/DD/YYYY&paymentMethod=ID&paymentMethod=ID2...
  const { endDate, startDate } = intervalDates(query)
  const paymentMethodArr: number[] = await setPaymentMethod(paymentMethod)
  const categoryArr: number[] = await setCategories(category)
  try {
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

    const composeReport = basicReport.map((charge) => {
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

    // res.json(basicReport)
    switch (report) {
      case 'arqByPayMethod':
        const byPayment: {
          amount: number
          paymentMethod: string
          id: number
          currency: { id: number; name: string; symbol: string }
          createdAt: Date
        }[] = []

        composeReport.forEach((charge) => {
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

        res.json(byPayment)
        break
      case 'arqByCategory':
        // for do :'v
        const byCategory: {
          amount: number
          category: string
          id: number
          currency: { id: number; name: string; symbol: string }
        }[] = []

        composeReport.forEach((charge) => {
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

        res.json({ result: byCategory })
        break
      default:
        res.json({ error: `not report found` })
        break
    }
  } catch (error) {
    res.json({ error })
  }
}

function intervalDates({ start, end }: NextApiRequestQuery) {
  const startDate: string | undefined = Array.isArray(start) ? start[0] : start
  const endDate: string | undefined = Array.isArray(end) ? end[0] : end

  return {
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined
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
