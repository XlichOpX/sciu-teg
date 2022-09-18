import { InputGroup, Input, InputRightElement, InputGroupProps } from '@chakra-ui/react'
import { MdSearch } from 'react-icons/md'

function SearchInput({ placeholder, ...props }: InputGroupProps) {
  return (
    <InputGroup {...props}>
      <Input placeholder={placeholder} />
      <InputRightElement pointerEvents="none" color="gray.500" fontSize="lg">
        <MdSearch />
      </InputRightElement>
    </InputGroup>
  )
}

export default SearchInput
