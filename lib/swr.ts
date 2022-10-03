import type { SWRConfiguration } from 'swr'
import { fetch } from './fetch'

export const swrConfig: SWRConfiguration = {
  fetcher: (resource, init) => fetch(resource, init)
}
