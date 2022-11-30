import { Address } from '@prisma/client'
import { fetch } from 'lib/fetch'

export const createAddress = async (shortAddress: string) => {
  return (await fetch('/api/address', { method: 'POST', body: { shortAddress } })) as Address
}

export const getAddresses = async (search: string) => {
  return (await fetch(`/api/address?keyword=${search}`)) as Address[]
}
