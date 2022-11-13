import { Prisma } from '@prisma/client'
import { reportArqueo } from 'prisma/queries'

export type ReportArqueo = Prisma.ChargeGetPayload<typeof reportArqueo>
