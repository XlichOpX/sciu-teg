import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { currencyUpdateSchema } from 'schema/currencySchema'
import validateBody from 'utils/bodyValidate'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(currencyHandler, ironOptions)

async function currencyHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'READ_CURRENCY'))) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UNA 'moneda'
      try {
        const currency = await prisma.currency.findFirst({
          where: { id: Number(id) }
        })
        if (!currency) return res.status(404).end(`Currency not found`)
        res.status(201).send(currency)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_CURRENCY')))
        return res.status(403).send(`Can't edit this.`)
      //actualizamos a UNA 'moneda'
      try {
        const currency = await prisma.currency.findFirst({
          where: { id: Number(id) }
        })
        if (!currency) return res.status(404).end(`Currency not found`)

        //Validate body
        const validBody = await validateBody(body, currencyUpdateSchema)

        const updateCurrency = await prisma.currency.update({
          data: {
            ...validBody.data
          },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updateCurrency)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_CURRENCY')))
        return res.status(403).send(`Can't delete this.`)
      //eliminamos a UNA 'moneda'
      try {
        const paymentMethod = await prisma.paymentMethod.count({
          where: { currencies: { some: { id: { equals: Number(id) } } } }
        })
        if (paymentMethod > 0) return res.status(409).send('Error relationships exist')

        const delCurrency = await prisma.currency.delete({ where: { id: Number(id) } })
        res.status(202).send(delCurrency)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
