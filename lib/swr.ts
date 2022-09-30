import type { SWRConfiguration } from 'swr'

export const swrConfig: SWRConfiguration = {
  fetcher: (resource, init) =>
    fetch(resource, init).then((res) => {
      if (res.ok) return res.json()
      throw new Error('Ocurrió un error al comunicarse con el servidor.')
    })
}
