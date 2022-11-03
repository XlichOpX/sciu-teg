import { useRouter } from 'next/router'
import { useCallback, useLayoutEffect, useState } from 'react'
import { z } from 'zod'

const pageValidator = z.preprocess(
  (arg) => parseInt(arg as string, 10),
  z.number().int().positive().default(1)
)

export const usePagination = ({
  initialPage = 1,
  itemsPerPage = 16,
  scrollToTop = true,
  savePage = true
}: {
  initialPage?: number
  itemsPerPage?: number
  scrollToTop?: boolean
  savePage?: boolean
} = {}) => {
  const router = useRouter()
  const validationResult = pageValidator.safeParse(router.query.page)
  const [page, setPageState] = useState(
    validationResult.success ? validationResult.data : initialPage
  )

  useLayoutEffect(() => {
    scrollToTop && window.scroll({ top: 0 })
  }, [page, scrollToTop])

  const setPage = useCallback(
    (page: number) => {
      setPageState(page)
      if (!savePage) return
      const url = new URL(window.location.origin + router.asPath)
      url.searchParams.set('page', page.toString())
      router.push(url)
    },
    [savePage, router]
  )

  return {
    offset: (page - 1) * itemsPerPage,
    limit: itemsPerPage,
    page,
    setPage
  }
}
