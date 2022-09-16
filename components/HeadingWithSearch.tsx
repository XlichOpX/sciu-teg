import { Divider, Flex, Heading } from '@chakra-ui/react'
import SearchInput from './SearchInput'

function HeadingWithSearch({ title, placeholder }: { title: string; placeholder: string }) {
  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <Heading as="h1" textAlign={['center', 'left']}>
          {title}
        </Heading>
        <SearchInput w="auto" placeholder={placeholder} />
      </Flex>
      <Divider my={4} />
    </>
  )
}

export default HeadingWithSearch
