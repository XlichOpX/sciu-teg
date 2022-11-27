import { fetch } from 'lib/fetch'
import { ReceiptWithAll } from 'types/receipt'
import { Sheet } from 'types/utils'

/**
 * Sube un archivo de excel formateado en objeto para generar cobros en lote
 * @param sheet objeto Sheet.
 * @returns array de recibos creados
 */
export const uploadChargesBatch = async (sheet: Sheet) => {
  const response = (await fetch('/api/lotStudents', {
    method: 'POST',
    body: sheet
  })) as ReceiptWithAll[]

  return response
}
