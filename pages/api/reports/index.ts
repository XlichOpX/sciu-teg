import { Prisma } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import _ from 'lodash'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextApiRequestQuery } from 'next/dist/server/api-utils'
import { BasicReport } from 'types/report'
import { canUserDo } from 'utils/checkPermissions'

export default withIronSessionApiRoute(handle, ironOptions)

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { method, session, query } = req
  if (!(method === 'GET')) return res.json({ error: 'method not allowed' })
  if (!canUserDo(session, 'READ_REPORT')) return res.status(403).send(`Can't read this.`)

  const { report, paymentMethod, category } = query
  // queryString like: reports?report=arqByPayMethod&start=MM/DD/YYYY&end=MM/DD/YYYY&paymentMethod=ID&paymentMethod=ID2...
  const { endDate, startDate } = intervalDates(query)
  const paymentMethodArr: number[] = await setPaymentMethod(paymentMethod)
  const categoryArr: number[] = await setCategories(category)
  try {
    const basicReport = await prisma.$queryRaw<BasicReport[]>`select
        (pm."name" || ' ' || c4.symbol) as "paymentMethod",
        c2."name" as "category",
        sum(ps."price") as "amount",
        sum(ps.price * c3.dolar) "dolarAmount",
        sum(ps.price * c3.euro) "euroAmount"
      from
        "Charge" c
      join "ProductSale" ps on
        ps."receiptId" = c."receiptId"
      join "Product" p on
        p.id = ps."productId"
      join "Category" c2 on
        c2.id = p."categoryId"
      join "Conversion" c3 on
        c3.id = c."conversionId"
      join "PaymentMethod" pm on
        pm.id = c."paymentMethodId"
      join "Currency" c4 on
        pm."currencyId" = c4.id 
      where 
        c."createdAt" >= ${startDate}
        and
        c."createdAt" <= ${endDate}
        and
        c2.id in (${Prisma.join(categoryArr)})
        and
        pm.id in (${Prisma.join(paymentMethodArr)})
      group by
        pm.id,
        c2.id ,
        pm."name",
        c2."name",
	      c4."symbol"
      order by
        "amount" desc,
        "category" desc,
        "paymentMethod" desc
      `

    switch (report) {
      case 'arqByPayMethod':
        const byPayment = _.groupBy(basicReport, 'paymentMethod')
        res.json({
          result: byPayment
        })
        break
      case 'arqByCategory':
        const byCategory = _.groupBy(basicReport, 'category')
        res.json({ result: byCategory })
        break
      default:
        res.json({ error: `not report found` })
        break
    }
  } catch (error) {
    res.json({ error })
  }
}

function intervalDates({ start, end }: NextApiRequestQuery) {
  const startDate: string | undefined = Array.isArray(start) ? start[0] : start
  const endDate: string | undefined = Array.isArray(end) ? end[0] : end

  return {
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined
  }
}

async function setCategories(category: string[] | string | undefined) {
  if (category) {
    return Array.isArray(category) ? category.map((e) => Number(e)) : [Number(category)]
  } else {
    const categories = await prisma.category.findMany({ select: { id: true } })
    return categories.map((cat) => cat.id)
  }
}
async function setPaymentMethod(paymentMethod: string[] | string | undefined) {
  if (paymentMethod) {
    return Array.isArray(paymentMethod)
      ? paymentMethod.map((e) => Number(e))
      : [Number(paymentMethod)]
  } else {
    const paymentMethod = await prisma.paymentMethod.findMany({ select: { id: true } })
    return paymentMethod.map((pm) => pm.id)
  }
}

/**
 import { Prisma } from '@prisma/client'
 const tables = Prisma.dmmf.datamodel.models
 * Para crear reportes en este sistema:
 * 0.) ¿Lo haremos dinámico?
 *
 * 1.) Crear tabla donde almacenar la estructura de estos.
 *
 * 2.) Definir la estructura y evidentemente los datos que almacenará la tabla relacionada
 *
 * 3.) Recuperar la estructura almacenada en la tabla, iterarla para preparar la/las queries necesarias
 * generando así las consultas necesarias a la base de datos y entregando información lógica bajo
 * los parámetros asignados.
 *
 * 4.) Establecer una interface (endpoint para backend) simple que reciba la configuración y cree estas estructuras de
 * reportes
 * Esta interface debe establecer previamente relaciones para limitar y evitar búsquedas sin sentido.
 * (Ej. ❌ Personas -> Conversiones
 * 			✅ Personas -> Recibos -> Conversiones
 * )
 *
 * 5.) Así mismo establecer una interface (endpoint para backend) que consuma la estructura y muestre el resultado
 * esperado. Esta a su vez, tendrá también algunos datos o campos que se puedan utilizar para filtrar la información
 * entregada (en el frontEnd)
 * 6.) Dar la capacidad de imprimir
 *
 * Idea de la estructura a manejar como 'reportSchema'
 * ReportSchema {
 * 	reportName: string					(Nombre del reporte dado por el usuario),
 * 	dataModels: {								(Arreglo de objetos que modelará cada tabla a utilizar)
 * 		table: string, 						(nombre de la tabla)
 * 		fields: {									(nombre de los campos a extraer de la tabla)
 * 			name: string,						(nombre del campo)
 * 			type: string,						(tipo del campo según Schema de prisma)
 * 			isId: boolean,					( si es el id o no)
 * 			kind: FieldKind					(si es un scalar, una referencia (object) u otra cosa)
 * 		}[],
 * 		isPrimary: boolean				(indicará si es la tabla principal)(default false)
 * 	}[],
 * 	orderBy: { 									(Objecto que dicta que campo y que orden usar por defecto en la query)
 * 		field: string,
 * 		sorter: 'asc' | 'desc' 		(default 'desc')
 * 	}
 * }
 *
 * ModelParser {								(Objeto que contendrá los nombres 'referenciales' para la gente de las entidades. Podría ser una tabla)
 * 	[modelName:string]: string
 * }
 *
 * Podríamos crear una tabla donde se almacenen todas las relaciones para ser consumidas de forma 'simple' por el sistema
 * (aunque no habría forma de actualizarla automáticamente, mejor utilizar lógica para esto...)
 * Model = Tabla
 * Field = Campo de la tabla
 * Type = Tipo de dado según schema de Prisma
 * Kind = Si un dato normal, una relación o algo distinto
 */
