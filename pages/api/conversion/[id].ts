import { Conversion } from '@prisma/client'
import dayjs from 'dayjs'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUnserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(conversionHandler, ironOptions)
async function conversionHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!canUnserDo(session, 'READ_CONVERSION')) return res.status(403).send(`Can't read this.`)
  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UNA conversión
      try {
        const conversion = await prisma.conversion.findFirst({
          where: { id: Number(id) }
        })
        if (!conversion) res.status(404).end(`Conversion not found`)
        res.status(200).send(conversion)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!canUnserDo(session, 'EDIT_CONVERSION')) return res.status(403).send(`Can't edit this.`)
      //actualizamos a UNA conversión
      try {
        const conversion = await prisma.conversion.findFirst({ where: { id: Number(id) } })
        if (!conversion) return res.status(404).end(`Conversion not found`)
        if (dayjs(conversion.date).add(30, 'minutes') < dayjs())
          res.status(404).end(`Can't Conversion update`)

        const updateConversion: Conversion = await prisma.conversion.update({
          data: {
            ...body
          },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updateConversion)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!canUnserDo(session, 'DELETE_CONVERSION'))
        return res.status(403).send(`Can't delete this.`)

      //eliminamos a UNA conversión
      try {
        const conversion = await prisma.conversion.findFirst({ where: { id: Number(id) } })
        if (!conversion) return res.status(404).end(`Conversion not found`)

        if (dayjs(conversion.date).add(30, 'minutes') < dayjs())
          res.status(404).end(`Can't Conversion update`)

        const delConversion: Conversion = await prisma.conversion.delete({
          where: { id: Number(id) }
        })
        res.status(202).send(delConversion)
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
