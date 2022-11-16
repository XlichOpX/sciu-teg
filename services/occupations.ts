import { Occupation } from '@prisma/client'
import { fetch } from 'lib/fetch'

export const getOccupations = async (search: string) => {
  return (await fetch('/api/occupation' + (search ? `?keyword=${search}` : ''))) as Occupation[]
}

export const createOccupation = async (occupation: string) => {
  return (await fetch('/api/occupation', {
    method: 'POST',
    body: { occupation }
  })) as Occupation
}
