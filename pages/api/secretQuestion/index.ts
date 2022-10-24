import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUnserDo } from 'utils/checkPermissions'
import { stringSearch } from 'utils/routePaginate'

// GET|POST /api/secretQuestion
export default withIronSessionApiRoute(handle, ironOptions)
async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    body,
    method,
    session,
    query: { keyword }
  } = req
  switch (method) {
    case 'GET':
      if (!canUnserDo(session, 'READ_SECRETQUESTION'))
        return res.status(403).send(`Can't read this.`)
      //obtenemos TODAS las preguntas secretas
      try {
        const secretQuestions = await prisma.secretQuestion.findMany({
          where: { question: stringSearch(keyword) }
        })
        res.status(200).send(secretQuestions)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!canUnserDo(session, 'CREATE_SECRETQUESTION'))
        return res.status(403).send(`Can't create this.`)
      //creamos UNA pregunta secreta
      try {
        const result = await prisma.secretQuestion.create({
          data: { ...body }
        })
        res.status(201).send(result)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}
