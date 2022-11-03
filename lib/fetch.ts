import { HttpError } from './http-error'

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

  try {
    const res = await window.fetch(input, options)
    if (res.ok) return res.json()
    const errorMsg = await res.text()
    throw new HttpError(errorMsg, res.status)
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Ocurrió un error al conectar con el servidor.')
    }
  }
}
