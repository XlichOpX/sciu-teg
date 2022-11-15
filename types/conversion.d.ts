import { createConversionSchema } from 'schema/conversionSchema'
import { z } from 'zod'

export type CreateConversionInput = z.infer<typeof createConversionSchema>
