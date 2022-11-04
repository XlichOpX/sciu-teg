import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { studentWithPersonStatusCareerAndEnrolledSemesters } from 'prisma/queries'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(studentHandler, ironOptions)
async function studentHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'READ_STUDENT'))) return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN estudiante
      try {
        const student = await prisma.student.findFirst({
          ...studentWithPersonStatusCareerAndEnrolledSemesters,
          where: { id: Number(id) }
        })
        if (!student) res.status(404).end(`Student not found`)
        res.status(200).send(student)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_STUDENT')))
        return res.status(403).send(`Can't edit this.`)
      //actualizamos a UN estudiante
      try {
        const student = await prisma.student.findFirst({
          where: { id: Number(id) }
        })
        if (!student) res.status(404).end(`Student not found`)

        const updateStudent = await prisma.student.update({
          data: { ...body },
          where: {
            id: Number(id)
          },
          ...studentWithPersonStatusCareerAndEnrolledSemesters
        })

        res.status(201).send(updateStudent)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_STUDENT')))
        return res.status(403).send(`Can't delete this.`)
      //eliminamos a UN estudiante
      try {
        const delStudent = await prisma.student.delete({ where: { id: Number(id) } })
        res.status(202).send(delStudent)
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
