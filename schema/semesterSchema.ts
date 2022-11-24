import { z } from 'zod'

export const semesterCreateSchema = z.object({
  startDate: z.string().min(10, 'Seleccione una fecha').max(10),
  endDate: z.string().min(10, 'Seleccione una fecha').max(10),
  semester: z.string().min(1).max(30)
})

export const semesterUpdateSchema = semesterCreateSchema.partial()
