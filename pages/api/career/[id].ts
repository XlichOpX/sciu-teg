import { Career } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(careerHandler, ironOptions)

async function careerHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'READ_CAREER'))) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      try {
        //obtenemos a UNA carrera
        const career = await prisma.career.findFirst({
          where: { id: Number(id) }
        })
        if (!career) res.status(404).end(`Career not found`)
        res.status(200).send(career)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }

      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_CAREER')))
        return res.status(403).send(`Can't edit this.`)
      try {
        const career = await prisma.career.findFirst({
          where: { id: Number(id) }
        })
        if (!career) res.status(404).end(`Career not found`)
        //actualizamos a UNA carrera
        const updateCareer: Career = await prisma.career.update({
          data: {
            ...body
          },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updateCareer)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_CAREER')))
        return res.status(403).send(`Can't delete this.`)
      try {
        //eliminamos a UNA carrera
        const student = await prisma.student.count({
          where: { careerId: Number(id) }
        })

        if (student > 0) return res.status(404).json(`Error, exists asosiated students`)

        const delCareer: Career = await prisma.career.delete({ where: { id: Number(id) } })
        res.status(202).send(delCareer)
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
