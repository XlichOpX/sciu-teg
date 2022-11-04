import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { canUserDo } from 'utils/checkPermissions'
import { stringSearch } from 'utils/routePaginate'

// GET|POST /api/secret
export default withIronSessionApiRoute(handle, ironOptions)
async function handle(req: NextApiRequest, res: NextApiResponse) {
  const {
    body,
    method,
    session,
    query: { username }
  } = req

  switch (method) {
    case 'GET':
      if (!(await canUserDo(session, 'READ_SECRET')))
        return res.status(403).send(`Can't read this.`)
      //obtenemos TODOS los secretos
      try {
        const where = { user: { username: stringSearch(username) } }

        const secrets = await prisma.secret.findMany({
          select: {
            id: true,
            questionOne: true,
            questionTwo: true,
            questionThree: true,
            user: { select: { id: true, username: true } }
          },
          where
        })

        if (username) {
          if (!(secrets[0]?.user?.username === username))
            return res.status(404).end(`Error, user not full match`)
          res.status(200).json(secrets[0])
        }

        res.status(200).send(secrets)
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      if (!(await canUserDo(session, 'CREATE_SECRET')))
        return res.status(403).send(`Can't create this.`)
      //creamos UN secreto
      try {
        const result = await prisma.secret.create({
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
