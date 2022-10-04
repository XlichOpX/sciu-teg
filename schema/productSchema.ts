import { z } from 'zod'
// schema para validar input tanto de post como put
export const productSchema = z.object({
  name: z.string().min(1).max(64),
  stock: z.number().int(),
  price: z.number().nonnegative(),
  categoryId: z.number().int().positive()
})
