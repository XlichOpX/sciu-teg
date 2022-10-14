import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import { NextApiRequest, NextApiResponse } from 'next'

export default withIronSessionApiRoute(logoutRoute, ironOptions)

function logoutRoute(req: NextApiRequest, res: NextApiResponse<{ ok: boolean }>) {
  req.session.destroy()
  return res.json({ ok: true })
}
