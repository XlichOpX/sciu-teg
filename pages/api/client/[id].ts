import { Client } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { clientWithPersonAndOccupation } from 'prisma/queries'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(clientHandler, ironOptions)
async function clientHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'READ_CLIENT'))) return res.status(403).send(`Can't read this.`)
  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN cliente
      try {
        const client = await prisma.client.findFirst({
          where: { id: Number(id) },
          ...clientWithPersonAndOccupation
        })
        if (!client) res.status(404).end(`Client not found`)
        res.status(200).send(client)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_CLIENT')))
        return res.status(403).send(`Can't edit this.`)
      //actualizamos a UN cliente
      try {
        const client = await prisma.client.findFirst({
          where: { id: Number(id) }
        })
        if (!client) res.status(404).end(`Client not found`)
        const updateClient = await prisma.client.update({
          data: {
            ...body
          },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updateClient)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_CLIENT')))
        return res.status(403).send(`Can't delete this.`)
      //eliminamos a UN cliente
      try {
        const delClient: Client = await prisma.client.delete({ where: { id: Number(id) } })
        res.status(202).send(delClient)
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
