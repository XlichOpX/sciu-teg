import { Receipt } from '@prisma/client'
import { fetch } from 'lib/fetch'

/**
 * Sube un archivo de excel para generar cobros en lote
 * @param file archivo codificado en base64
 * @returns array de recibos creados
 */
export const uploadChargesBatch = async (file: string) => {
  const response = (await fetch('/api/lotStudents', {
    method: 'POST',
    body: file
  })) as { receiptArr: Receipt[] }

  return response.receiptArr
}
