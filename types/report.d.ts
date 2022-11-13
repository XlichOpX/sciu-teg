import { Prisma } from '@prisma/client'
import { reportArqueo } from 'prisma/queries'

export type ReportArqueo = Prisma.ChargeGetPayload<typeof reportArqueo>

export type BasicReport = {
  paymentMethod: string
  category: string
  amount: number
  dolarAmount: number
  euroAmount: number
}
