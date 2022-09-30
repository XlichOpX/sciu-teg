type FetchParams = Parameters<typeof window.fetch>
type Input = FetchParams[0]
interface CustomInit extends RequestInit {
  body?: any
}

export const fetch = (input: Input, { headers, body, ...init }: CustomInit = {}) => {
  const options = {
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
    ...init
  }
  return window.fetch(input, options)
}
