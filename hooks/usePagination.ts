import { useState } from 'react'

function usePagination({
  initialPage = 1,
  itemsPerPage = 16
}: {
  initialPage?: number
  itemsPerPage?: number
} = {}) {
  const [page, setPage] = useState(initialPage)

  return {
    offset: (page - 1) * itemsPerPage,
    limit: itemsPerPage,
    page,
    setPage
  }
}

export default usePagination
