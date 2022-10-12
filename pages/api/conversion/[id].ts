import { Conversion } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'
import dayjs from 'dayjs'

export default async function conversionHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id }
  } = req

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UNA conversión
      const conversion: Conversion | null = await prisma.conversion.findFirst({
        where: { id: Number(id) }
      })
      if (!conversion) res.status(404).end(`Conversion not found`)
      res.status(200).send(conversion)
      break
    case 'PUT':
      //actualizamos a UNA conversión
      const updateConversion: Conversion = await prisma.conversion.update({
        data: {
          ...body
        },
        where: {
          id: Number(id)
        }
      })
      if (!updateConversion) res.status(404).end(`Conversion not found`)
      if (dayjs(updateConversion.date).add(30, 'minutes') < dayjs())
        res.status(404).end(`Conversion can't update`)
      res.status(201).send(updateConversion || {})
      break
    case 'DELETE':
      //eliminamos a UNA conversión
      const delConversion: Conversion = await prisma.conversion.delete({
        where: { id: Number(id) }
      })
      if (dayjs(delConversion.date).add(30, 'minutes') < dayjs())
        res.status(404).end(`Conversion can't update`)
      res.status(202).send(delConversion)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
