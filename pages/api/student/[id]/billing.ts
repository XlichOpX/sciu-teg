import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from 'lib/ironSession'
import prisma from 'lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { studentWithPersonCareerAndStatus } from 'prisma/queries'
import { checkBillings } from 'utils/checkBillings'
import { canUserDo } from 'utils/checkPermissions'
import { stringSearch } from 'utils/routePaginate'
import { z } from 'zod'
// Validate typeof id
const documentVal = z.string().min(1).max(12)

// GET /student/[id]/billing
export default withIronSessionApiRoute(billingHandle, ironOptions)

async function billingHandle(req: NextApiRequest, res: NextApiResponse) {
  const {
    method,
    query: { id: docNum },
    session
  } = req
  if (!(await canUserDo(session, 'CREATE_BILLING'))) return res.status(403).send(`Can't read this.`)

  // Validamos que el método utilizado sea GET.
  if (method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }

  // Validamos que el docNum sea un string válido (entre 1 y 12 caracteres)
  const { success } = documentVal.safeParse(docNum)
  if (!success) return res.status(404).send(`Document Number ${docNum} Not Allowed`)

  //Obtenemos al estudiante a partir de su número de identificación (Document Number)
  try {
    // Declaremos lo que necesitamos...
    const student = await prisma.student.findFirst({
      ...studentWithPersonCareerAndStatus,
      where: { person: { docNumber: stringSearch(docNum) } }
    })
    if (!student) return res.status(404).send(`Student doc:${docNum} not found`)

    // Validamos sí hay 'billings' por generar o no y los devolvemos.
    const billings = await checkBillings(student)

    res.status(200).json({ student, billings })
  } catch (error) {
    if (error instanceof Error) {
      console.log(error)
      res.status(400).send(error.message)
    }
  }
}
