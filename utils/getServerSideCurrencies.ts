import { Currency } from '@prisma/client'
import prisma from 'lib/prisma'
export default async function getServerSideCurrencies() {
  return (await prisma.currency.findMany({
    select: { id: true, name: true, symbol: true }
  })) as Currency[]
}
