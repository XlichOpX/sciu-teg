import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(addressHandler, ironOptions)

async function addressHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'READ_ADDRESS'))) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UNA dirección
      try {
        const address = await prisma.address.findFirst({
          where: { id: Number(id) }
        })
        if (!address) return res.status(404).end(`Address not found`)
        res.status(200).send(address)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_ADDRESS')))
        return res.status(403).send(`Can't edit this.`)
      //actualizamos a UNA dirección
      try {
        const address = await prisma.address.findFirst({
          where: { id: Number(id) }
        })
        if (!address) return res.status(404).end(`Address not found`)

        const updateAddress = await prisma.address.update({
          data: {
            ...body
          },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updateAddress)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_ADDRESS')))
        return res.status(403).send(`Can't delete this.`)
      //eliminamos a UNA dirección
      try {
        const address = await prisma.address.findFirst({ where: { id: Number(id) } })
        if (!address) return res.status(404).end(`Address not found`)

        const delAddress = await prisma.address.delete({ where: { id: Number(id) } })
        res.status(202).send(delAddress)
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
