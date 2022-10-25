import { Secret } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { compare } from 'lib/crypter'
import { CookieUser, ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  // enviar una sesión temporal que permita hacer los próximos pasos
  //(leer el secret by user, responder las preguntas secretas y modificar la contraseña del usuario entregado.)
  const { method, query, body } = req
  switch (method) {
    case 'GET':
      try {
        //crearemos la sesión temporal para dar acceso al usuario 'anonimous'
        const { username } = query
        if (!username) return

        const anonymous = {
          id: 0,
          status: { id: 0, status: 'recovery' },
          permissions: [{ permission: 'READ_SECRET_RECOVERY_MODE', description: 'RECOVERY_MODE' }],
          username: 'recovery_mode'
        } as CookieUser

        req.session.user = anonymous
        // save iSession cookie
        await req.session.save()
        // respond with a ok response.
        res.json({ ok: true })
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    case 'POST':
      // tomamos el BODY y validamos las respuestas que en él se hayan...
      try {
        //error temporal. Toca ponerlo chido
        if (!body) return res.status(403).end(`Error, not body`)

        /** body like:
         * 	{
         * 		username: pepito,
         * 		id: 1 <del usuario>,
         * 		answerOne: XXX,
         * 		answerTwo: XXX,
         *  	answerThree: XXX,
         * 	}
				 * 
            { permission: 'EDIT_USER_RECOVERY_MODE', description: 'RECOVERY_MODE' },
            { permission: 'ACCESS_USERS_MUTATION_RECOVERY_MODE', description: 'RECOVERY_MODE' }
         */
        const { id } = body
        const secret = await prisma.secret.findFirst({ where: { user: { id: id } } })
        if (!secret) return res.status(403).end(`Error, not password found`)

        for (const key in body) {
          if (Object.prototype.hasOwnProperty.call(body, key) && key.includes('answer')) {
            const requestValue = body[key]
            const secretValue = secret[key as keyof Secret]
            if (!(secretValue && compare(requestValue, secretValue as string)))
              return res.status(403).end(`Error, not match Answer.`)
          }
        }

        const anonymous = {
          id: 0,
          status: { id: 0, status: 'recovery' },
          permissions: [
            { permission: 'EDIT_USER_RECOVERY_MODE', description: 'RECOVERY_MODE' },
            { permission: 'ACCESS_USERS_MUTATION_RECOVERY_MODE', description: 'RECOVERY_MODE' }
          ],
          username: 'recovery_mode'
        } as CookieUser

        req.session.user = anonymous
        // save iSession cookie
        await req.session.save()
        // respond with a ok response.
        res.json({ ok: true })
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
  res.status(200)
}
