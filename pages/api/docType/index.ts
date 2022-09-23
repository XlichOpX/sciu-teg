import { DocType } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

// GET|POST /api/docType
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req

  switch (method) {
    case 'GET':
      //obtenemos TODOS los tipos de documentos
      const docTypes: DocType[] | null = await prisma.docType.findMany()

      if (!docTypes) res.status(404).end(`DocTypes not found`)
      res.status(200).send(docTypes)
      break
    case 'POST':
      //creamos UN tipo de documento
      const result: DocType = await prisma.docType.create({
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
