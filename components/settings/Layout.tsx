import { Divider, Heading } from '@chakra-ui/react'
import SidebarLayout from 'components/SidebarLayout'
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
      <SidebarLayout sidebar={<Sidebar />}>{children}</SidebarLayout>
    </>
  )
}

export default Layout
