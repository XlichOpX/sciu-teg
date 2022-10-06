import { compare } from 'lib/crypter'
import { ironOptions } from 'lib/ironSession'
import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import prisma from 'lib/prisma'
import { z } from 'zod'

export default withIronSessionApiRoute(loginRoute, ironOptions)

const input = z.object({
  username: z.string(),
  password: z.string()
})

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const result = input.safeParse(req.body)
  if (!result.success) {
    return res.status(403).json(result.error.message)
  }
  const { username, password } = result.data

  try {
    // retrieve user password from database
    const user = await prisma.user.findFirst({
      where: { username },
      include: { roles: { include: { permissions: true } }, status: true }
    })
    // validate that username exists in db
    if (!user) return invalidCredentials(res)
    
    // validate that given password matches db password
    const isValid = compare(password, user.password)
    
    if (!isValid) return invalidCredentials(res)
    
    const { roles, id, status } = user
    
    // validate that user status is different from inactive
    if (status.id === 0) return res.status(403).json('User is inactive. Contact an admin.')

    // Retrieve permissions of the roles of user. 
    const permissions = await prisma.permission.findMany({
      select: { permission: true, description: true },
      where: { roles: { some: { users: { some: { id: user?.id } } } } }
    })

    req.session.user = { id, status, permissions, username }

    // save iSession cookie
    await req.session.save()

    // respond with a CookieUser object.
    res.json({ id, status, roles, username })
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message })
    }
  }
}

const invalidCredentials = (res: NextApiResponse) =>
  res.status(403).json({ error: 'Invalid credentials' })
