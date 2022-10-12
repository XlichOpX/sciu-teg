import { Divider, Heading } from '@chakra-ui/react'
import { BaseLayout, SidebarLayout } from 'components/layouts'
import Head from 'next/head'
import { ReactNode } from 'react'
import { SettingsSidebar } from './SettingsSidebar'

export const SettingsLayout = ({ children, title }: { children: ReactNode; title?: string }) => (
  <BaseLayout>
    <Head>
      <title>{`Configuración${title && ` - ${title}`}`}</title>
    </Head>
    <Heading as="h1" textAlign={{ base: 'center', md: 'left' }}>
      Configuración
    </Heading>
    <Divider my={4} />
    <SidebarLayout sidebar={<SettingsSidebar />}>{children}</SidebarLayout>
  </BaseLayout>
)
