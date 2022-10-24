import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { roleWithPermissions } from 'prisma/queries'
import { canUnserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(roleHandler, ironOptions)
async function roleHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!canUnserDo(session, 'READ_ROLE')) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN rol
      try {
        const role = await prisma.role.findFirst({
          ...roleWithPermissions,
          where: { id: Number(id) }
        })
        if (!role) res.status(404).end(`Role not found`)
        res.status(200).send(role)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!canUnserDo(session, 'EDIT_ROLE')) return res.status(403).send(`Can't edit this.`)
      //actualizamos a UN rol
      try {
        const role = await prisma.role.findFirst({
          where: { id: Number(id) }
        })
        if (!role) res.status(404).end(`Role not found`)

        const updateRole = await prisma.role.update({
          data: {
            ...body
          },
          where: {
            id: Number(id)
          },
          ...roleWithPermissions
        })
        res.status(201).send(updateRole)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!canUnserDo(session, 'DELETE_ROLE')) return res.status(403).send(`Can't delete this.`)
      //eliminamos a UN rol
      try {
        const user = await prisma.user.count({
          where: { id: Number(id) }
        })
        if (user > 0) res.status(404).end(`Role relation exists`)

        const delRole = await prisma.role.delete({ where: { id: Number(id) } })
        res.status(202).send(delRole)
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
