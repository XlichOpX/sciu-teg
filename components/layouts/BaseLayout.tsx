import { Container } from '@chakra-ui/react'
import Head from 'next/head'
import { ReactNode } from 'react'
import { Navbar } from '../app/Navbar'

export const BaseLayout = ({ children }: { children: ReactNode }) => (
  <>
    <Head>
      <title>SCIU</title>
      <meta name="description" content="Sistema de Cobranzas para una Institución Universitaria" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Navbar />
    <Container maxW="container.xl" as="main" py={4}>
      {children}
    </Container>
  </>
)
