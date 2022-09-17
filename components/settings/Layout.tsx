import { Divider, Heading } from '@chakra-ui/react'
import BaseLayout from 'components/BaseLayout'
import SidebarLayout from 'components/SidebarLayout'
import Head from 'next/head'
import { ReactNode } from 'react'
import Sidebar from './Sidebar'

function Layout({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <BaseLayout>
      <Head>
        <title>Configuración{title && ` - ${title}`}</title>
      </Head>
      <Heading as="h1" textAlign={{ base: 'center', md: 'left' }}>
        Configuración
      </Heading>
      <Divider my={4} />
      <SidebarLayout sidebar={<Sidebar />}>{children}</SidebarLayout>
    </BaseLayout>
  )
}

export default Layout
