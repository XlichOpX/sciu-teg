export const debounce = (fn: () => void, ms: number) => {
  let timeout: NodeJS.Timeout | undefined
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn()
    }, ms)
  }
}
