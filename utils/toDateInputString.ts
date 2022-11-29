import dayjs, { Dayjs } from 'dayjs'

export const toDateInputString = (date: Date | Dayjs) => {
  return dayjs(date).format('YYYY-MM-DD')
}
