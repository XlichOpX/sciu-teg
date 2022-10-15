import { Prisma } from '@prisma/client'
import { NextApiRequestQuery } from 'next/dist/server/api-utils'

export function routePaginate({ limit, offset }: NextApiRequestQuery) {
  const take = Number(Array.isArray(limit) ? limit[0] : limit) || 5
  const skip = Number(Array.isArray(offset) ? offset[0] : offset) || 0
  return {
    take,
    skip
  }
}

export function search(keyword?: string | string[], mode?: Prisma.QueryMode): Prisma.StringFilter {
  return {
    contains: Array.isArray(keyword) ? keyword[0] : keyword,
    mode: mode || 'insensitive'
  }
}
