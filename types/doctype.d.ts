import { DocType } from '@prisma/client'
import { createDoctypeSchema } from 'schema/doctypeSchema'
import { z } from 'zod'

export type DocType = DocType
export type CreateDoctypeInput = z.infer<typeof createDoctypeSchema>
export type UpdateDoctypeInput = CreateDoctypeInput
