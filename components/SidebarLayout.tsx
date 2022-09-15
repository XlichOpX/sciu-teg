import { Grid, GridItem } from '@chakra-ui/react'
import { ReactNode } from 'react'

function SidebarLayout({ children, sidebar }: { children: ReactNode; sidebar: ReactNode }) {
  return (
    <Grid templateColumns={{ base: '1fr', md: '25% 1fr' }} gap={4}>
      <GridItem>{sidebar}</GridItem>
      <GridItem>{children}</GridItem>
    </Grid>
  )
}

export default SidebarLayout
