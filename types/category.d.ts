import { categorySchema } from 'schema/categorySchema'
import { z } from 'zod'

export type CategoryInput = z.infer<typeof categorySchema>
