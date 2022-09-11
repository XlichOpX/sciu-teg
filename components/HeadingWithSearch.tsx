import { Heading, Divider, Flex, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { MdSearch } from 'react-icons/md'

function HeadingWithSearch({ title, placeholder }: { title: string; placeholder: string }) {
  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" gap={4} wrap="wrap">
        <Heading as="h1" width={['full', 'auto']} textAlign={['center', 'left']}>
          {title}
        </Heading>
        <InputGroup width={['full', '2xs']}>
          <Input placeholder={placeholder} />
          <InputRightElement pointerEvents="none" color="gray.500" fontSize="lg">
            <MdSearch />
          </InputRightElement>
        </InputGroup>
      </Flex>
      <Divider my={4} />
    </>
  )
}

export default HeadingWithSearch
