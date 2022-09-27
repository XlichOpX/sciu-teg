import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session/edge'
import { ironOptions } from 'lib/ironSession'

export const middleware = async (req: NextRequest) => {
	const res = NextResponse.next();
  const session = await getIronSession(req, res, ironOptions);

	  // do anything with session here:
		const { user } = session;
		 // like mutate user:
  // user.something = someOtherThing;
  // or:
  // session.user = someoneElse;

  // uncomment next line to commit changes:
  // await session.save();
  // or maybe you want to destroy session:
  // await session.destroy();

  console.log("from middleware", { user });

  if(!user) { 
		return NextResponse.redirect(new URL(`/auth/login?redirect=${req.nextUrl}`, req.url))
	}

  if (user?.username !== "kurokuro15") {
    return new NextResponse(null, { status: 403 }); // unauthorized to see pages inside admin/
  }

  return res;
};

export const config = {
  matcher: "/access",
};