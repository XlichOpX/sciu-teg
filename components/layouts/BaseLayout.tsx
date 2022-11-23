import { chakra, Container } from '@chakra-ui/react'
import { FullyCenteredSpinner } from 'components/app'
import { useAuth } from 'hooks'
import Head from 'next/head'
import { ReactNode } from 'react'
import { Navbar } from '../app/Navbar'

export const BaseLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  return (
    <>
      <Head>
        <title>SCIU</title>
        <meta
          name="description"
          content="Sistema de Cobranzas para una Institución Universitaria"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {user ? (
        <>
          <Navbar />
          <Container maxW="container.xl" as="main" py={4}>
            {children}
          </Container>
        </>
      ) : (
        <chakra.div h="100vh" w="100vw">
          <FullyCenteredSpinner height="full" />
        </chakra.div>
      )}
    </>
  )
}
