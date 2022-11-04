import type { SWRConfiguration } from 'swr'
import { fetch } from './fetch'

export const swrConfig: SWRConfiguration = {
  fetcher: (resource, init) => fetch(resource, init),
  onErrorRetry: (error) => {
    // Never retry on 404.
    if (error.status === 404) return
  }
}
