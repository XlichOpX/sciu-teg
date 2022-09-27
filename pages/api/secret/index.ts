import { Secret } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/secret
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODOS los secretos
      const secrets: Secret[] | null = await prisma.secret.findMany()

      if (!secrets) return res.status(404).end(`Secrets not found`)
      res.status(200).send(secrets)
      break
    case 'POST':
      //creamos UN secreto
      const result: Secret = await prisma.secret.create({
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
