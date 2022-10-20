import { ChakraProvider } from '@chakra-ui/react'
import { swrConfig } from 'lib/swr'
import 'lib/zod'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { theme } from 'theme'

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <ChakraProvider theme={theme}>
      <SWRConfig value={swrConfig}>{getLayout(<Component {...pageProps} />)}</SWRConfig>
    </ChakraProvider>
  )
}

export default MyApp
