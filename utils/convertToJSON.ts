import { DataMatriz, RawRowData, RowData } from 'types/utils'

export const parse = async (headers: RawRowData, data: DataMatriz): Promise<RowData[]> => {
  const rows: RowData[] = []
  data.forEach(async (row) => {
    const rowData: RowData = {}
    row.forEach(async (element, index) => {
      rowData[headers[index] as string] = element
    })
    console.log('rowData', rowData)
    rows.push(rowData)
  })
  return rows
}
