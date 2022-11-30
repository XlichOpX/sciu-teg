import dayjs from 'dayjs'
import { z, ZodTypeAny } from 'zod'

export const castToDate = z.preprocess((val) => {
  if (typeof val === 'string') {
    return dayjs(val).toDate()
  }
}, z.date())

/** Convierte un string vacío a undefined antes de validar */
export const castEmptyString = <T extends ZodTypeAny>(schema: T) =>
  z.preprocess((val) => {
    if (val === '') {
      return undefined
    }
  }, schema)
