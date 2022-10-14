import { getIronSession } from 'iron-session/edge'
import { ironOptions } from 'lib/ironSession'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next()
  const session = await getIronSession(req, res, ironOptions)
  const { pathname } = req.nextUrl
  const { user } = session

  const isApiRoute = pathname.includes('/api')
  const isAuth = pathname.includes('/auth/login')
  const isUnauthorized = pathname.includes('/unauthorized')

  if (!isAuth && !user && !isUnauthorized) {
    if (isApiRoute) return NextResponse.redirect(new URL('/api/unauthorized', req.url))
    else return NextResponse.redirect(new URL(`/auth/login?redirect=${pathname}`, req.url))
  }

  return res
}

export const config = {
  matcher: ['/access', '/api/:path*']
}
