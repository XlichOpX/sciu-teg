type FetchParams = Parameters<typeof window.fetch>
type Input = FetchParams[0]
interface CustomInit extends Omit<RequestInit, 'body'> {
  body?: unknown
}

export const fetch = async (input: Input, { headers, body, ...init }: CustomInit = {}) => {
  const options = {
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
    ...init
  }

  const res = await window.fetch(input, options)
  if (res.ok) return res.json()

  const error = await res.text()
  throw new Error(error)
}
