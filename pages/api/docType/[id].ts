import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(docTypeHandler, ironOptions)
async function docTypeHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'READ_DOCTYPE'))) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN tipo de documento
      try {
        const docType = await prisma.docType.findFirst({
          where: { id: Number(id) }
        })
        if (!docType) res.status(404).end(`DocType not found`)
        res.status(201).send(docType)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_DOCTYPE')))
        return res.status(403).send(`Can't edit this.`)
      //actualizamos a UN tipo de documento
      try {
        const docType = await prisma.docType.findFirst({
          where: { id: Number(id) }
        })
        if (!docType) res.status(404).end(`DocType not found`)
        const updateDocType = await prisma.docType.update({
          data: {
            ...body
          },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updateDocType)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      try {
        if (!(await canUserDo(session, 'DELETE_DOCTYPE')))
          return res.status(403).send(`Can't delete this.`)
        //eliminamos a UN tipo de documento
        const person = await prisma.person.count({
          where: { docTypeId: Number(id) }
        })
        if (person > 0) return res.status(409).end(`DocType relation exists`)
        const delDocType = await prisma.docType.delete({ where: { id: Number(id) } })
        res.status(202).send(delDocType)
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
