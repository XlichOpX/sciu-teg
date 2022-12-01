import { Alert, chakra, Container } from '@chakra-ui/react'
import { FullyCenteredSpinner, LatestConversionsHelper } from 'components/app'
import { useAuth } from 'hooks'
import Head from 'next/head'
import { ReactNode } from 'react'
import { Navbar } from '../app/Navbar'

export const BaseLayout = ({ children }: { children: ReactNode }) => {
  const { user, error } = useAuth()
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
            <LatestConversionsHelper
              buttonProps={{ pos: 'fixed', left: 2, bottom: 2, p: 1 }}
              popoverContentProps={{ marginLeft: 2 }}
            />
          </Container>
        </>
      ) : (
        <chakra.div h="100vh" w="100vw" p={4}>
          {!error && <FullyCenteredSpinner height="full" />}
          {error && (
            <Alert status="error">
              No se pudo obtener la información de usuario: {error.message}
            </Alert>
          )}
        </chakra.div>
      )}
    </>
  )
}
