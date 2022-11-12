import dayjs from 'dayjs'

export const parseCellContent = (cell: unknown) => {
  let content: string | number | null
  if (typeof cell === 'string' || typeof cell === 'number') {
    content = cell
  } else if (typeof cell === 'object' && cell instanceof Date) {
    content = dayjs(cell).format('DD/MM/YYYY')
  } else if (cell === null) {
    content = ''
  } else {
    content = 'Desconocido'
  }
  return content
}
