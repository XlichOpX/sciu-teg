import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import z from 'zod'

export default withIronSessionApiRoute(secretQuestionHandler, ironOptions)

async function secretQuestionHandler(req: NextApiRequest, res: NextApiResponse) {
  // Validate typeof id
  const idValidation = z.preprocess((value) => Number(value), z.number().positive())

  const {
    body,
    method,
    query: { id },
    session
  } = req
  if (!(await canUserDo(session, 'READ_SECRETQUESTION')))
    return res.status(403).send(`Can't read this.`)

  const { success } = idValidation.safeParse(id)
  if (!success) return res.status(404).send(`Id ${id} Not Allowed`)

  switch (method) {
    case 'GET':
      //obtenemos a UNA pregunta secreta
      try {
        const secretQuestion = await prisma.secretQuestion.findFirst({
          where: { id: Number(id) }
        })
        if (!secretQuestion) res.status(404).end(`SecretQuestion not found`)
        res.status(200).send(secretQuestion)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'PUT':
      if (!(await canUserDo(session, 'EDIT_SECRETQUESTION')))
        return res.status(403).send(`Can't edit this.`)
      //actualizamos a UNA pregunta secreta
      try {
        const secretQuestion = await prisma.secretQuestion.findFirst({
          where: { id: Number(id) }
        })
        if (!secretQuestion) res.status(404).end(`SecretQuestion not found`)

        const updateSecretQuestion = await prisma.secretQuestion.update({
          data: {
            ...body
          },
          where: {
            id: Number(id)
          }
        })
        res.status(201).send(updateSecretQuestion)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'DELETE':
      if (!(await canUserDo(session, 'DELETE_SECRETQUESTION')))
        return res.status(403).send(`Can't delete this.`)
      //eliminamos a UNA pregunta secreta
      try {
        const delSecretQuestion = await prisma.secretQuestion.delete({ where: { id: Number(id) } })
        res.status(202).send(delSecretQuestion)
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
