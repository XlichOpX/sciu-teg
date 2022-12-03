import { ChakraProvider } from '@chakra-ui/react'
import { chromium } from '@playwright/test'
import { ReceiptDetail } from 'components/receipts'
import { hashString } from 'lib/crypter'
import dayjs from 'lib/dayjs'
import prisma from 'lib/prisma'
import _ from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'
import { receiptWithAll } from 'prisma/queries'
import { renderToStaticMarkup } from 'react-dom/server'
import { theme } from 'theme'
import { ReceiptWithAll } from 'types/receipt'
import { sendMail } from 'utils/sendMail'
import { z } from 'zod'

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req
  switch (method) {
    case 'POST':
      try {
        const from = '"Instituto Universitario Jesús Obrero - Sede Catia" <caja@iujo.edu.ve>'
        const { receipts } = body
        const validBody = z.number().array().safeParse(receipts)
        if (!validBody.success) throw new Error('not request valid')

        const receiptWithAllArray = await prisma.receipt.findMany({
          ...receiptWithAll,
          where: { id: { in: receipts } }
        })

        const receiptsByStudent = _.groupBy(receiptWithAllArray, 'person.docNumber')

        for (const docNum in receiptsByStudent) {
          const person = await prisma.person.findFirstOrThrow({
            select: { email: true, docType: { select: { type: true } }, docNumber: true },
            where: { docNumber: docNum }
          })
          const receiptArr = receiptsByStudent[docNum]
          const pdfArr = receiptArr.map((receipt) => {
            return prepareReportPdf(receipt)
          })
          // preparamos el correo a enviar.
          const attachments = await Promise.all(pdfArr)
          const mailOption = {
            from,
            to: person.email,
            subject: `IUJO CAJA - ${person.docType.type}:${person.docNumber} - ${dayjs()
              .locale('es')
              .format('dddd, MMMM D, YYYY')}`,
            attachments,
            text: 'Hola, te enviamos a continuación tú recibo del día de hoy'
          }
          await sendMail(mailOption)
        }
        res.json({ message: 'All Mail sended' })
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).send(error.message)
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
      break
  }
}

/**
 * Función que prepara el PDF, devuelve el nombre del archivo (un texto encriptado)
 * y el pdf como Buffer
 * @param receipt ReceiptWithAll
 * @returns
 */
async function prepareReportPdf(receipt: ReceiptWithAll) {
  const hash = hashString(
    `${receipt.person.firstName} ${receipt.person.firstLastName} - ${receipt.id}`
  )
  const filename = `${hash}.pdf`

  const content = await convertReceiptToPdf(receipt, { landscape: true, format: 'a4' })
  return { filename, content }
}
/**
 * Función que convierte en PDF el recibo pasado parametrizado por las opciones dadas
 * @param receipt ReceiptWithAll
 * @param options Opciones para manejar la impresión del PDF
 * @returns
 */
export async function convertReceiptToPdf(
  receipt: ReceiptWithAll,
  options: { landscape: boolean; format: string }
) {
  const parameters = await prisma.parameters.findFirst()
  if (!parameters) throw Error('parameters not found')
  const html = renderToStaticMarkup(
    ChakraProvider({ children: ReceiptDetail({ receipt, parameters }), theme })
  )
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  await page.setContent(html)
  const pdf = await page.pdf(options)
  await browser.close()

  return pdf
}
