import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import { NextApiRequest, NextApiResponse } from 'next'

export default withIronSessionApiRoute(logoutRoute, ironOptions)

function logoutRoute(req: NextApiRequest, res: NextApiResponse<{ isDestroy: boolean }>) {
  req.session.destroy()
  res.json({ isDestroy: true })
}
