import { Dayjs } from 'dayjs'
import dayjs from 'lib/dayjs'

export const toLocaleDateString = (date: Date | Dayjs | string) => dayjs(date).format('DD-MM-YYYY')
