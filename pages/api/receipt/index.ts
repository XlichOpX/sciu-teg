import { Prisma, PrismaClient, Receipt } from '@prisma/client'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextApiRequestQuery } from 'next/dist/server/api-utils'
import { receiptWithPerson } from 'prisma/queries'
import { receiptCreateSchemaInput } from 'schema/receiptSchema'
import { GetReceiptWithPersonResponse } from 'types/receipt'
import { canUserDo } from 'utils/checkPermissions'
import { insertReceipt } from 'utils/insertReceipt'
import { intSearch, routePaginate, stringSearch } from 'utils/routePaginate'
// GET|POST /api/receipt
export default withIronSessionApiRoute(handle, ironOptions)

async function handle(
  req: NextApiRequest,
  res: NextApiResponse<GetReceiptWithPersonResponse | string | Receipt>
) {
  const { body, method, query, session } = req

  switch (method) {
    case 'GET':
      if (!(await canUserDo(session, 'READ_RECEIPT')))
        return res.status(403).send(`Can't read this.`)
      try {
        const response = await getReceipts(query, prisma)
        res.json(response)
      } catch (error) {
        res.status(500).end(`Hubo un error:\n${JSON.stringify(error, null, 2)}`)
      }
      break

    case 'POST':
      if (!(await canUserDo(session, 'CREATE_RECEIPT')))
        return res.status(403).send(`Can't create this.`)
      //creamos UN recibo
      const validBody = receiptCreateSchemaInput.safeParse(body)
      if (!validBody.success) {
        return res.status(403).end(`Error, not all data send`)
      }
      try {
        const result = await insertReceipt(validBody.data)
        res.json(result)
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

const getReceipts = async (
  query: NextApiRequestQuery,
  prisma: PrismaClient
): Promise<GetReceiptWithPersonResponse> => {
  const { keyword, document } = query
  const searchQuery = stringSearch(keyword) || stringSearch(document)

  // obtenemos TODOS los productos
  const where: Prisma.ReceiptWhereInput = keyword
    ? {
        OR: [
          { person: { docNumber: searchQuery } },
          { person: { firstName: searchQuery } },
          { person: { middleName: searchQuery } },
          { person: { secondLastName: searchQuery } },
          { person: { firstLastName: searchQuery } },
          { id: intSearch(keyword) }
        ]
      }
    : {}

  const count = await prisma.receipt.count({ where })
  //obtenemos TODOS los recibos
  // Recibos con información escencial de la persona
  const result = await prisma.receipt.findMany({
    ...receiptWithPerson,
    ...routePaginate(query),
    where,
    orderBy: {
      id: 'desc'
    }
  })
  return { count, result }
}
