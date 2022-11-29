import dayjs from 'lib/dayjs'
import { z } from 'zod'

export const semesterUpdateSchema = z
  .object({
    startDate: z.string().min(10, 'Seleccione una fecha').max(10),
    endDate: z.string().min(10, 'Seleccione una fecha').max(10)
  })
  .refine(
    (val) => {
      const startDate = dayjs(val.startDate)
      const endDate = dayjs(val.endDate)
      return startDate < endDate
    },
    { message: 'La fecha de inicio debe ser menor a la fecha de fin' }
  )
