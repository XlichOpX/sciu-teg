import { Grid, GridItem } from '@chakra-ui/react'
import { ReactNode } from 'react'

export const SidebarLayout = ({
  children,
  sidebar
}: {
  children: ReactNode
  sidebar: ReactNode
}) => (
  <Grid templateColumns={{ base: '1fr', md: '25% 1fr' }} gap={4}>
    <GridItem>{sidebar}</GridItem>
    <GridItem>{children}</GridItem>
  </Grid>
)
