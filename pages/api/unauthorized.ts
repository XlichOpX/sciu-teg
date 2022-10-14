import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import { NextApiRequest, NextApiResponse } from 'next'

export default withIronSessionApiRoute(unauthorizedHandle, ironOptions)

function unauthorizedHandle(req: NextApiRequest, res: NextApiResponse) {
  return res.status(403).json({ message: 'Missing Authentication Token' })
}
