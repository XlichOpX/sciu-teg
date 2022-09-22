import { Address } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function studentHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UNA dirección
      const address: Address | null = await prisma.address.findFirst({
        where: { id: Number(id) }
      })
      if (!address) res.status(404).end(`Address not found`)
      res.status(200).send(address)
      break
    case 'PUT':
      //actualizamos a UNA dirección
      const updateAddress: Address = await prisma.address.update({
        data: {
          ...body
        },
        where: {
          id: Number(id)
        }
      })
      if (!updateAddress) res.status(404).end(`Address not found`)
      res.status(201).send(updateAddress || {})
      break
    case 'DELETE':
      //eliminamos a UNA dirección
      const delAddress: Address = await prisma.address.delete({ where: { id: Number(id) } })
      res.status(202).send(delAddress)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
