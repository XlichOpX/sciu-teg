import { Person } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/person
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODAS las personas
      const people: Person[] | null = await prisma.person.findMany()
      
      if (!people) res.status(404).end(`People not found`)
      res.status(200).send(people)
      break
    case 'POST':
      //creamos UNA persona
      const result : Person = await prisma.person.create({
        data: { ...body }
      })
      res.status(201).send(result)
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
