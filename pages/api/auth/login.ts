import { compare } from 'lib/crypter'
import { ironOptions } from 'lib/ironSession'
import { NextApiRequest, NextApiResponse } from 'next'
import { withIronSessionApiRoute } from 'iron-session/next'
import prisma from 'lib/prisma'

export default withIronSessionApiRoute(loginRoute, ironOptions)

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = JSON.parse(req.body)

  if (!username || !password) return res.status(403).json('username or password not in the json')

  try {
    // retrieve user password from database
    const user = await prisma.user.findFirst({
      where: { username },
      include: { roles: true, status: true }
    })

    // validate exist username in db
    if (!user) return res.status(403).json('username invalid')

    // validate password matches with db password
    const isValid = compare(password, user.password)

    console.log({ valid: isValid, password, token: user.password })

    if (!isValid)
      return res.status(403).json("Does'nt a valid username or password? idk english, sorry.")

    const { roles, id, status } = user
    // validate that if the user is distinct to inactive user status
    if (status.id === 0)
      return res.status(403).json('User inactive. Contact with an Administrator.')
    req.session.user = { id, status, roles, username }

    // save cookie iSession
    await req.session.save()

    // response with a CookieUser object.
    res.json({ id, status, roles, username })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}
