import { ChakraProvider } from '@chakra-ui/react'
import { chromium } from '@playwright/test'
import { ReceiptDetail } from 'components/receipts'
import { hashString } from 'lib/crypter'
import dayjs from 'lib/dayjs'
import prisma from 'lib/prisma'
import _ from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'
import { receiptWithAll } from 'prisma/queries'
import { renderToStaticMarkup } from 'react-dom/server'
import { theme } from 'theme'
import { ReceiptWithAll } from 'types/receipt'
import { z } from 'zod'
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  /**
   * Recibo el arreglo de recibos o ids de recibos
   * Itero cada uno y voy generando:
   * Genero el pdf que se necesita para el recibo
   * lo almaceno en un arreglo
   * Para enviar el correo requiero email, nombre del estudiante y crear un asunto dinámico, así como un cuerpo dinámico
   * envío un correo con todos los pdf 'cargados'
   * devuelvo una respuesta OK o un error con información del mismo.
   */
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

export async function sendMail({ from, to, subject, text, html, attachments }: Mail.Options) {
  // Only needed if you don't have a real mail account for testing
  // const testAccount = await nodemailer.createTestAccount()

  const transportObject = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'hailie.murazik@ethereal.email',
      pass: 'CEaBeDaG17gtR1Gn8Y'
    }
  }

  // const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env
  // const transportObject: SMTPTransport.Options = {
  //   host: SMTP_HOST,
  //   port: Number(SMTP_PORT),
  //   auth: {
  //     user: SMTP_USER,
  //     pass: SMTP_PASS
  //   }
  // }

  const transporter = nodemailer.createTransport({ ...transportObject })

  // send mail with defined transport object

  const info = await transporter.sendMail({
    from, // sender address
    to, // list of receivers
    subject, // Subject line
    text, //Text inline information,
    html, //Html template that use in the message
    attachments // attach files array
  })
  console.log(info.messageId)
  if (info.accepted.includes(to as string)) return true
  else throw new Error(`no delivered email from ${to}`)
}

async function prepareReportPdf(receipt: ReceiptWithAll) {
  const hash = hashString(
    `${receipt.person.firstName} ${receipt.person.firstLastName} - ${receipt.id}`
  )
  const filename = `${hash}.pdf`

  const content = await convertReceiptToPdf(receipt, { landscape: true, format: 'a4' })
  return { filename, content }
}

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
