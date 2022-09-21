import prisma from '../lib/prisma'
import { compare } from '../lib/crypter'
import { RequestInternal } from 'next-auth'

// En este archivo generaré la lógica detrás del proveedor de credenciales.
// posteriormente importarla dentro de la api de next-Auth
// ¿Autorizar usuario?
// primer paso, recibir los datos.
// realizar el envío de los datos al ep de la db
// segundo paso, buscar la contraseña a partir del usuario.
// tercer paso, comparar la contraseña introducida con la de la db.
// devolver respuesta correcta.

// Add logic here to look up the user from the credentials supplied
// const user = { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
// If no error and we have user data, return it

export async function loging(
  credentials: Record<'username' | 'password', string> | undefined
): Promise<{
  id: number
  statusId: number
  username: string
} | null> {
  // incoming username and password...

  const username = credentials?.username
  const password = credentials?.password

  if (!username || !password) throw new Error('username or password not send')

  // retrieve user password from database
  const user = await prisma.user.findFirst({
    where: { username }
  })

  // validate exist username in db
  if (!user) throw new Error('username invalid')
  const { id, statusId } = user
  // validate password matches with db password
  const isValid = compare(password, user.password)
  console.log({ valid: isValid, password, token: user.password })
  if (!isValid) return null

  return { id, statusId, username }
}

export async function authorize(
  credentials: Record<'username' | 'password', string> | undefined,
  req: Pick<RequestInternal, 'query' | 'body' | 'headers' | 'method'>
): Promise<{
  id: number
  statusId: number
  username: string
} | null> {
  return loging(credentials)
}
