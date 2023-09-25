import { IncomingMessage } from 'http'
import { get } from 'https'
import { BOLIVAR } from '../utils/constants'
import dayjs from './../lib/dayjs'
import prisma from './../lib/prisma'
import { sendMail } from './../utils/sendMail'
const url = process.env.CONVERSION_API_URL || 'https://bcv-api.deno.dev/v1/exchange'

export default function updateConversionCron() {
  try {
    console.log(
      `==Tarea: Actualización de Divisas : ${dayjs()
        .locale('es')
        .format('HH:mm:ss, dddd, MMMM D, YYYY')}`
    )

    return get(url, getHandle).on('error', (err) => {
      console.log('Error: ', err.message)
    })
  } catch (error) {}
}

const getHandle = (res: IncomingMessage) => {
  const { statusCode } = res
  const contentType = res.headers['content-type']

  if (statusCode !== 200) {
    throw new Error('Request Failed.\n' + `Status Code: ${statusCode}`) && res.resume()
  } else if (!contentType || !/^application\/json/.test(contentType)) {
    throw (
      new Error(
        'Invalid content-type.\n' + `Expected application/json but received ${contentType}`
      ) && res.resume()
    )
  }

  res.setEncoding('utf8')
  let rawData = ''
  res.on('data', (chunk) => {
    rawData += chunk
  })

  res.on('end', () => {
    try {
      parserConversions(JSON.parse(rawData))
    } catch (e) {
      if (e instanceof Error) console.error(e.message)
    }
  })
}

export type rawConversion = {
  currency: string
  exchange: number
  date: Date
}

const parserConversions = (rawConversion: rawConversion[]) => {
  return Promise.all(
    rawConversion.map(async (c) => {
      const { currency, date, exchange } = c
      if (currency != 'Dolar') return
      // hacer un llamado a la db y buscar cual es el currency adecuado según el campo currency.
      const dbCurr = await prisma.currency.findFirst({
        select: { id: true },
        where: { name: { startsWith: BOLIVAR, mode: 'insensitive' } }
      })
      if (!dbCurr) return

      const newConversion = createConversion(dbCurr.id, exchange, date)

      // crear el ConversionData con currency Object, exchange as value y date.
      return prisma.conversion.create({
        select: { currency: { select: { name: true, symbol: true } }, value: true, id: true },
        data: newConversion
      })
    })
  )
    .then((result) => {
      if (result) {
        const text = result.reduce(
          (t, c) =>
            c
              ? (t += `${c?.currency.name} a ${c?.currency.symbol}.${c?.value} por Dolar.`)
              : (t += ''),
          'Se ha actualizado el valor de '
        )
        return sendMail({
          from: 'SCIU - Conversión API <conversion@SCIU.edu.ve>',
          to: process.env.NOTIFICATION_MAIL,
          subject: `SCIU CAJA - Actualización de Divisas`,
          text
        })
      } else {
        throw new Error(`Algo ha ocurrido`)
      }
    })
    .then((result) =>
      console.log(
        `============================================================================
  Tarea: Actualización de Divisas ==> Terminada a las: ${dayjs()
    .locale('es')
    .format('HH:mm:ss, dddd, MMMM D, YYYY')}
  Identificación del Mensaje:${result.messageId}
============================================================================`
      )
    )
    .catch((err) => console.error(err.message))
  // Entregar todo y ver que todo fue OK. Enviar mensaje en caso de error
}

function createConversion(currency: number, value: number, date: Date) {
  return {
    currency: { connect: { id: currency } },
    value,
    date
  }
}
