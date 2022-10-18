import { useSWRConfig } from 'swr'

export const useMatchMutate = () => {
  const { cache, mutate } = useSWRConfig()
  return (matcher: RegExp | string, ...args: unknown[]) => {
    if (!(cache instanceof Map)) {
      throw new Error('matchMutate requires the cache provider to be a Map instance')
    }

    if (typeof matcher === 'string') {
      matcher = new RegExp(matcher)
    }

    const keys = []

    for (const key of cache.keys()) {
      if (matcher.test(key)) {
        keys.push(key)
      }
    }

    const mutations = keys.map((key) => mutate(key, ...args))
    return Promise.all(mutations)
  }
}
