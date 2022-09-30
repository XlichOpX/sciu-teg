import { ChakraProvider } from '@chakra-ui/react'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { fetch } from 'lib/fetch'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <ChakraProvider>
      <SWRConfig
        value={{ fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()) }}
      >
        {getLayout(<Component {...pageProps} />)}
      </SWRConfig>
    </ChakraProvider>
  )
}

export default MyApp
