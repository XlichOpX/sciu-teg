import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(permissionHandler, ironOptions)
async function permissionHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'READ_PERMISSION')))
    return res.status(403).send(`Can't read this.`)
  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN Permiso
      try {
        const permission = await prisma.permission.findFirst({
          where: { id: Number(id) }
        })
        if (!permission) res.status(404).end(`Permission not found`)
        res.status(200).send(permission)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_PERMISSION')))
        return res.status(403).send(`Can't edit this.`)
      //actualizamos a UN Permiso
      try {
        const permission = await prisma.permission.findFirst({
          where: { id: Number(id) }
        })
        if (!permission) res.status(404).end(`Permission not found`)
        const updatePermission = await prisma.permission.update({
          data: { ...body },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updatePermission)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_PERMISSION')))
        return res.status(403).send(`Can't delete this.`)
      //eliminamos a UN Permiso
      try {
        const role = await prisma.role.count({
          where: { permissions: { some: { id: Number(id) } } }
        })
        if (role > 0) return res.status(404).end(`Permission relation exists`)

        const delPermission = await prisma.permission.delete({ where: { id: Number(id) } })
        res.status(202).send(delPermission)
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
