import { z } from 'zod'
import { personSchema } from './userSchema'

export const createClientSchema = personSchema.extend({
  occupationId: z.number({ required_error: 'Requerido' }).int()
})
