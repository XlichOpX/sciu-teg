import { useRouter } from 'next/router'
import { useLayoutEffect } from 'react'
import { z } from 'zod'

const pageValidator = z.preprocess(
  (arg) => parseInt(arg as string, 10),
  z.number().int().positive().default(1)
)

export const usePagination = ({
  initialPage = 1,
  itemsPerPage = 16,
  scrollToTop = true
}: {
  initialPage?: number
  itemsPerPage?: number
  scrollToTop?: boolean
} = {}) => {
  const router = useRouter()
  const validationResult = pageValidator.safeParse(router.query.page)
  const page = validationResult.success ? validationResult.data : initialPage

  useLayoutEffect(() => {
    scrollToTop && window.scroll({ top: 0 })
  }, [scrollToTop])

  return {
    offset: (page - 1) * itemsPerPage,
    limit: itemsPerPage,
    page,
    setPage: (page: number) => {
      router.query.page = page.toString()
      router.push(router)
    }
  }
}
