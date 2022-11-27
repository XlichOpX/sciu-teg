import { NextApiRequest } from 'next'
import { SafeParseSuccess, z, ZodTypeAny } from 'zod'

export default async function validateBody<T extends ZodTypeAny>(
  body: NextApiRequest['body'],
  schema: T
) {
  const v = await schema.safeParseAsync(body)
  if (v.success) return v as SafeParseSuccess<z.infer<T>>
  else throw new Error(`Invalid Request`)
}
