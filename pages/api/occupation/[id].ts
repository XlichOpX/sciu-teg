import { Occupation } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(occupationHandler, ironOptions)
async function occupationHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'READ_OCCUPATION')))
    return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UNA ocupación de cliente
      try {
        const occupation = await prisma.occupation.findFirst({
          where: { id: Number(id) }
        })
        if (!occupation) res.status(404).end(`Occupation not found`)
        res.status(200).send(occupation)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_OCCUPATION')))
        return res.status(403).send(`Can't edit this.`)
      //actualizamos a UNA ocupación de cliente
      try {
        const occupation = await prisma.occupation.findFirst({
          where: { id: Number(id) }
        })
        if (!occupation) res.status(404).end(`Occupation not found`)
        const updateOccupation: Occupation = await prisma.occupation.update({
          data: {
            ...body
          },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updateOccupation)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_OCCUPATION')))
        return res.status(403).send(`Can't delete this.`)
      //eliminamos a UNA ocupación de cliente
      try {
        const client = await prisma.client.findFirst({
          where: { occupationId: Number(id) }
        })
        if (!client) res.status(404).end(`Occupation relation exists`)
        const delOccupation: Occupation = await prisma.occupation.delete({
          where: { id: Number(id) }
        })
        res.status(202).send(delOccupation)
        break
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
