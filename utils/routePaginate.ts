import { Prisma } from '@prisma/client'
import { NextApiRequestQuery } from 'next/dist/server/api-utils'
import dayjs from './../lib/dayjs'

export function routePaginate({ limit, offset }: NextApiRequestQuery) {
  const take = Number(Array.isArray(limit) ? limit[0] : limit) || 5
  const skip = Number(Array.isArray(offset) ? offset[0] : offset) || 0
  return {
    take,
    skip
  }
}

export function search<T>(keyword?: string | string[], mode?: Prisma.QueryMode): T | undefined {
  const keyw = Array.isArray(keyword) ? keyword[0] : keyword

  if (typeof keyw === 'undefined') return keyw

  if (dayjs(keyw).isValid() && isNaN(keyw as unknown as number))
    return { gte: dayjs(keyw).toDate() } as unknown as T

  return {
    contains: keyw,
    mode: mode || 'insensitive'
  } as unknown as T
}

export function dateTimeSearch(keyword?: string | string[]): Prisma.DateTimeFilter | undefined {
  const keyw = Array.isArray(keyword) ? keyword[0] : keyword
  if (typeof keyw === 'undefined') return keyw
  return { gte: dayjs(keyw).toDate() }
}

export function intSearch(keyword?: string | string[]): Prisma.IntFilter | undefined {
  const keyw = Array.isArray(keyword) ? keyword[0] : keyword
  if (typeof keyw === 'undefined' || isNaN(Number(keyw))) return undefined
  return {
    equals: Number(keyw)
  }
}

export function stringSearch(
  keyword?: string | string[],
  mode?: Prisma.QueryMode
): Prisma.StringFilter | undefined {
  const keyw = Array.isArray(keyword) ? keyword[0] : keyword
  if (typeof keyw === 'undefined') return keyw
  return {
    contains: keyw,
    mode: mode || 'insensitive'
  }
}
