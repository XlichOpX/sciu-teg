import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(parameterHandler, ironOptions)

async function parameterHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'READ_PARAMETER'))) return res.status(403).send(`Can't read this.`)
  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN parámetro
      try {
        const parameter = await prisma.parameters.findFirst({
          where: { id: Number(id) }
        })
        if (!parameter) res.status(404).end(`Parameter not found`)
        res.status(200).send(parameter)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_PARAMETER')))
        return res.status(403).send(`Can't edit this.`)
      //actualizamos a UN parámetro
      try {
        const updateParameter = await prisma.parameters.update({
          data: {
            ...body
          },
          where: {
            id: Number(id)
          }
        })
        if (!updateParameter) res.status(404).end(`Parameter not found`)
        res.status(201).send(updateParameter)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_PARAMETER')))
        return res.status(403).send(`Can't delete this.`)
      //eliminamos a UN parámetro
      try {
        const delParameter = await prisma.parameters.delete({ where: { id: Number(id) } })
        res.status(202).send(delParameter)
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
