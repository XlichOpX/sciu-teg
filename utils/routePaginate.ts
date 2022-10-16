import { Prisma } from '@prisma/client'
import dayjs from 'lib/dayjs'
import { NextApiRequestQuery } from 'next/dist/server/api-utils'

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

  console.log({ keyw })

  if (typeof keyw === 'undefined') return keyw

  if (dayjs(keyw).isValid() && isNaN(keyw as unknown as number))
    return { gte: dayjs(keyw).toDate() } as unknown as T

  return {
    contains: keyw,
    mode: mode || 'insensitive'
  } as unknown as T
}
