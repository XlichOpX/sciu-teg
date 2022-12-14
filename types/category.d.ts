import { Prisma } from '@prisma/client'
import { categoryWithRelationalProducts } from 'prisma/queries'
import { categorySchema } from 'schema/categorySchema'
import { z } from 'zod'

export type CategoryInput = z.infer<typeof categorySchema>
export type CategoryWithProducts = Prisma.CategoryGetPayload<typeof categoryWithRelationalProducts>
