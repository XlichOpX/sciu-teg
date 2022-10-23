import { Person } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { personWithAllData } from 'prisma/queries'
import { canUnserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(personHandler, ironOptions)

async function personHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!canUnserDo(session, 'READ_PERSON')) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UNA persona
      try {
        const person = await prisma.person.findFirst({
          ...personWithAllData,
          where: { id: Number(id) }
        })
        if (!person) res.status(404).end(`Person not found`)
        res.status(201).send(person)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!canUnserDo(session, 'EDIT_PERSON')) return res.status(403).send(`Can't edit this.`)
      //actualizamos a UNA persona
      try {
        const person = await prisma.person.findFirst({
          where: { id: Number(id) }
        })
        if (!person) res.status(404).end(`Person not found`)
        const updatePerson: Person = await prisma.person.update({
          data: {
            ...body
          },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updatePerson)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!canUnserDo(session, 'DELETE_PERSON')) return res.status(403).send(`Can't delete this.`)
      //eliminamos a UNA persona
      try {
        const delPerson: Person = await prisma.person.delete({ where: { id: Number(id) } })
        res.status(202).send(delPerson)
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
