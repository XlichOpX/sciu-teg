import dayjs from 'dayjs'

export const toDateInputString = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD')
}
