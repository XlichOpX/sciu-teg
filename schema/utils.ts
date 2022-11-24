import dayjs from 'dayjs'
import { z } from 'zod'

export const castToDate = z.preprocess((val) => {
  if (typeof val === 'string') {
    return dayjs(val).toDate()
  }
}, z.date())
