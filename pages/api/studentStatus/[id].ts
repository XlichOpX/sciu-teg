import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(studentStatusHandler, ironOptions)
async function studentStatusHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'READ_STUDENTSTATUS')))
    return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UN estado de estudiante
      try {
        const status = await prisma.studentStatus.findFirst({
          where: { id: Number(id) }
        })
        if (!status) res.status(404).end(`Status not found`)
        res.status(200).send(status)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_STUDENTSTATUS')))
        return res.status(403).send(`Can't edit this.`)
      //actualizamos a UN estado de estudiante
      try {
        const status = await prisma.studentStatus.findFirst({
          where: { id: Number(id) }
        })
        if (!status) res.status(404).end(`Status not found`)

        const updateStatus = await prisma.studentStatus.update({
          data: { ...body },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updateStatus)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_STUDENTSTATUS')))
        return res.status(403).send(`Can't delete this.`)
      //eliminamos a UN estado de estudiante
      try {
        const student = await prisma.student.count({
          where: { statusId: Number(id) }
        })
        if (student > 0) res.status(409).end(`Status ${student} relations exists`)

        const delStatus = await prisma.studentStatus.delete({
          where: { id: Number(id) }
        })
        res.status(202).send(delStatus)
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
