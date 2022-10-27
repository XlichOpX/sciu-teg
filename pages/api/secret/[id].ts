import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(secretHandler, ironOptions)
async function secretHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!canUserDo(session, 'READ_SECRET')) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN secreto
      try {
        const secret = await prisma.secret.findFirst({
          where: { id: Number(id) }
        })
        if (!secret) res.status(404).end(`Secret not found`)
        res.status(200).send(secret)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!canUserDo(session, 'EDIT_SECRET')) return res.status(403).send(`Can't edit this.`)
      //actualizamos a UN secreto
      try {
        const secret = await prisma.secret.findFirst({
          where: { id: Number(id) }
        })
        if (!secret) res.status(404).end(`Secret not found`)
        const updateSecret = await prisma.secret.update({
          data: {
            ...body
          },
          where: {
            id: Number(id)
          }
        })

        res.status(201).send(updateSecret)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!canUserDo(session, 'DELETE_SECRET')) return res.status(403).send(`Can't delete this.`)
      //eliminamos a UN secreto
      try {
        const delSecret = await prisma.secret.delete({ where: { id: Number(id) } })
        res.status(202).send(delSecret)
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
