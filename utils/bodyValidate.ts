import { NextApiRequest } from "next"
import { ZodTypeAny } from "zod"

export default function validateBody(body: NextApiRequest['body'], schema: ZodTypeAny) {
	const v = schema.safeParse(body)

	if (v.success) return v
	else throw new Error(`Invalid Request`)
}