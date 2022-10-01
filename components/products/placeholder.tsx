import { Divider, SimpleGrid, SkeletonText } from '@chakra-ui/react'
import { SimpleBox } from 'components'

function Placeholder() {
  return (
    <SimpleGrid minChildWidth="2xs" gap={4}>
      {Array.from({ length: 16 }).map((_, i) => (
        <SimpleBox key={i}>
          <SkeletonText noOfLines={2} />
          <Divider my={4} />
          <SkeletonText spacing={4} noOfLines={3} />
        </SimpleBox>
      ))}
    </SimpleGrid>
  )
}

export default Placeholder
