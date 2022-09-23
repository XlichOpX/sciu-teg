import { Person } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function personHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UNA persona
      const person: Person | null = await prisma.person.findFirst({
        include: {
          address: true,
          client: true,
          docType: true,
          receipts: false,
          student: true,
          user: true
        },
        where: { id: Number(id) }
      })
      if (!person) res.status(404).end(`Person not found`)
      res.status(201).send(person)
      break
    case 'PUT':
      //actualizamos a UNA persona
      const updatePerson: Person = await prisma.person.update({
        data: {
          ...body
        },
        where: {
          id: Number(id)
        }
      })
      if (!updatePerson) res.status(404).end(`Person not found`)
      res.status(201).send(updatePerson || {})
      break
    case 'DELETE':
      //eliminamos a UNA persona
      const delPerson: Person = await prisma.person.delete({ where: { id: Number(id) } })
      res.status(202).send(delPerson)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
