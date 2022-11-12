import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { GetUserResponse } from 'types/auth'
export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse<GetUserResponse | string>) {
  try {
    const { session } = req
    const { user } = session
    if (!user) return res.status(400).send(`cookie invalid.`)
    const roles = user?.role?.map((rol) => rol.id)
    const permissions = await prisma.permission.findMany({
      where: { roles: { some: { id: { in: roles } } } }
    })
    const response = { ...user, permissions }

    res.status(200).json(response)
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send(error.message)
    }
  }
}
