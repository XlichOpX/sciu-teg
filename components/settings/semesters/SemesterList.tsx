import { SimpleGrid } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { SemesterItem } from './SemesterItem'

export const SemesterList = ({ children }: { children: ReactNode }) => (
  <SimpleGrid minChildWidth="2xs" as="ul" listStyleType="none" gap={4}>
    {children}
  </SimpleGrid>
)

SemesterList.Item = SemesterItem
