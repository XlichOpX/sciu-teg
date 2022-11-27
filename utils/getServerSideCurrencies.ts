import { Currency } from '@prisma/client'

export default async function getServerSideCurrencies() {
  return (await prisma?.currency.findMany({
    select: { id: true, name: true, symbol: true }
  })) as Currency[]
}
