import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

export default withIronSessionApiRoute(refreshHandle, ironOptions)

async function refreshHandle(req: NextApiRequest, res: NextApiResponse) {
  const { session } = req
  if (!session.user) return res.status(404).end(`session not valid`)

  const user = await prisma.user.findFirst({
    where: { id: session.user.id },
    include: { status: true }
  })

  if (!user) return res.status(500).end(`user not found in session`)

  const permissions = await prisma.permission.findMany({
    select: { permission: true, description: true },
    where: { roles: { some: { users: { some: { id: session.user.id } } } } }
  })

  session.user = { id: user.id, username: user.username, status: user.status, permissions }
  await session.save()
  res.status(200).json({ ok: true })
}
