import { Divider, Flex, Heading } from '@chakra-ui/react'
import SearchInput, { SearchSubmitHandler } from './SearchInput'

function HeadingWithSearch({
  title,
  placeholder,
  onSubmit = () => null
}: {
  title: string
  placeholder: string
  onSubmit?: SearchSubmitHandler
}) {
  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <Heading as="h1" textAlign={['center', 'left']}>
          {title}
        </Heading>
        <SearchInput placeholder={placeholder} onSubmit={onSubmit} />
      </Flex>
      <Divider my={4} />
    </>
  )
}

export default HeadingWithSearch
