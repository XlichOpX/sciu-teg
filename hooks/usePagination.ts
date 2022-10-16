import { useLayoutEffect, useState } from 'react'

export const usePagination = ({
  initialPage = 1,
  itemsPerPage = 16,
  scrollToTop = true
}: {
  initialPage?: number
  itemsPerPage?: number
  scrollToTop?: boolean
} = {}) => {
  const [page, setPageState] = useState(initialPage)

  useLayoutEffect(() => {
    scrollToTop && window.scroll({ top: 0 })
  }, [page, scrollToTop])

  return {
    offset: (page - 1) * itemsPerPage,
    limit: itemsPerPage,
    page,
    setPage: (page: number) => {
      setPageState(page)
    }
  }
}
