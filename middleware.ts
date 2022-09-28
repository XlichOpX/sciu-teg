import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session/edge'
import { ironOptions } from 'lib/ironSession'

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next()
  const session = await getIronSession(req, res, ironOptions)

  const { user } = session

  if (!user) {
    return NextResponse.redirect(new URL(`/auth/login?redirect=${req.nextUrl.pathname}`, req.url))
  }

  return res
}

export const config = {
  matcher: ['/access']
}
