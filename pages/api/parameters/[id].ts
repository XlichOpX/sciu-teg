import { Parameters } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function parameterHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UN parámetro
      const parameter: Parameters | null = await prisma.parameters.findFirst({
        where: { id: Number(id) }
      })
      if (!parameter) res.status(404).end(`Parameter not found`)
      res.status(200).send(parameter)
      break
    case 'PUT':
      //actualizamos a UN parámetro
      const updateParameter: Parameters = await prisma.parameters.update({
        data: {
          ...body
        },
        where: {
          id: Number(id)
        }
      })
      if (!updateParameter) res.status(404).end(`Parameter not found`)
      res.status(201).send(updateParameter || {})
      break
    case 'DELETE':
      //eliminamos a UN parámetro
      const delParameter: Parameters = await prisma.parameters.delete({ where: { id: Number(id) } })
      res.status(202).send(delParameter)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
