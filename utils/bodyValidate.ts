import { NextApiRequest } from 'next'
import { SafeParseSuccess, z, ZodTypeAny } from 'zod'

export default function validateBody<T extends ZodTypeAny>(
  body: NextApiRequest['body'],
  schema: T
) {
  const v = schema.safeParse(body)
  if (v.success) return v as SafeParseSuccess<z.infer<T>>
  else throw new Error(`Invalid Request`)
}
