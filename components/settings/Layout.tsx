import { Divider, Grid, GridItem, Heading } from '@chakra-ui/react'
import Head from 'next/head'
import { ReactNode } from 'react'
import Sidebar from './Sidebar'

function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>Configuración</title>
      </Head>
      <Heading as="h1" textAlign={{ base: 'center', md: 'left' }}>
        Configuración
      </Heading>
      <Divider my={4} />
      <Grid templateColumns={{ base: '1fr', md: '25% 1fr' }} gap={4}>
        <GridItem>
          <Sidebar />
        </GridItem>

        <GridItem>{children}</GridItem>
      </Grid>
    </>
  )
}

export default Layout
