import { Prisma } from '@prisma/client'
import { productSchema } from 'schema/productSchema'
import { productWithCategory } from 'pages/api/product'
import { z } from 'zod'
// select base para las query de producto, sirve además para generar el tipo

export type ProductWithCategory = Prisma.ProductGetPayload<typeof productWithCategory>
export type GetProductsResponse = { count: number; result: ProductWithCategory[] }
export type ProductInput = z.infer<typeof productSchema>
