import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(semesterHandler, ironOptions)
async function semesterHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'READ_SEMESTER'))) return res.status(403).send(`Can't read this.`)
  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN semestre
      try {
        const semester = await prisma.semester.findFirst({
          where: { id: Number(id) }
        })
        if (!semester) return res.status(404).end(`Semester not found`)
        res.status(200).send(semester)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_SEMESTER')))
        return res.status(403).send(`Can't edit this.`)
      //actualizamos a UN semestre
      try {
        const semester = await prisma.semester.findFirst({
          where: { id: Number(id) }
        })
        if (!semester) return res.status(404).end(`Semester not found`)

        const updateSemester = await prisma.semester.update({
          data: {
            ...body
          },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updateSemester)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_SEMESTER')))
        return res.status(403).send(`Can't delete this.`)
      //eliminamos a UN semestre
      try {
        const semester = await prisma.semester.findFirst({
          where: { id: Number(id) }
        })
        if (!semester) return res.status(404).end(`Semester not found`)

        const billing = await prisma.billing.count({ where: { semesterId: Number(id) } })
        if (billing > 0) return res.status(409).end('Error relationships exist')

        const delSemester = await prisma.semester.delete({ where: { id: Number(id) } })
        res.status(202).send(delSemester)
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
