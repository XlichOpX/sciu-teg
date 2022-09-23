import { DocType } from '@prisma/client'
import prisma from '../../../lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import z from 'zod'

export default async function DocTypeHandler(req: NextApiRequest, res: NextApiResponse) {
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
      //obtenemos a UN tipo de documento
      const docType: DocType | null = await prisma.docType.findFirst({
        where: { id: Number(id) }
      })
      if (!docType) res.status(404).end(`DocType not found`)
      res.status(201).send(docType)
      break
    case 'PUT':
      //actualizamos a UN tipo de documento
      const updateDocType: DocType = await prisma.docType.update({
        data: {
          ...body
        },
        where: {
          id: Number(id)
        }
      })
      if (!updateDocType) res.status(404).end(`DocType not found`)
      res.status(201).send(updateDocType || {})
      break
    case 'DELETE':
      //eliminamos a UN tipo de documento
      const delDocType: DocType = await prisma.docType.delete({ where: { id: Number(id) } })
      res.status(202).send(delDocType)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
