import { Person } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import type { NextApiRequest, NextApiResponse } from 'next'
import { personWithAllData } from 'prisma/queries'
import { canUnserDo } from 'utils/checkPermissions'
import z from 'zod'
import prisma from '../../../lib/prisma'

export default withIronSessionApiRoute(personHandler, ironOptions)

async function personHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const { body, method, query, session } = req
  if (!canUnserDo(session, 'READ_PERSON')) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(query.id)
  if (!success) return res.status(404).send(`Id ${query.id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UNA persona

      const person = await prisma.person.findFirst({
        ...personWithAllData,
        where: { id: Number(query.id) }
      })
      if (!person) res.status(404).end(`Person not found`)
      res.status(201).send(person)
      break
    case 'PUT':
      if (!canUnserDo(session, 'EDIT_PERSON')) return res.status(403).send(`Can't edit this.`)
      //actualizamos a UNA persona
      const updatePerson: Person = await prisma.person.update({
        data: {
          ...body
        },
        where: {
          id: Number(query.id)
        }
      })
      if (!updatePerson) res.status(404).end(`Person not found`)
      res.status(201).send(updatePerson || {})
      break
    case 'DELETE':
      if (!canUnserDo(session, 'DELETE_PERSON')) return res.status(403).send(`Can't delete this.`)
      //eliminamos a UNA persona
      const delPerson: Person = await prisma.person.delete({ where: { id: Number(query.id) } })
      res.status(202).send(delPerson)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
