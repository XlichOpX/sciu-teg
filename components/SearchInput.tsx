import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { InputGroup, Input, InputRightElement } from '@chakra-ui/react'
import { MdSearch } from 'react-icons/md'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { debounce } from 'utils/debounce'

const schema = z.object({ text: z.string() })
export type SearchInput = z.infer<typeof schema>
export type SearchSubmitHandler = SubmitHandler<SearchInput>

function SearchInput({
  placeholder,
  onChange = () => null,
  onSubmit = () => null
}: {
  placeholder: string
  onChange?: SearchSubmitHandler
  onSubmit?: SearchSubmitHandler
}) {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<SearchInput>({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup w="auto">
        <Input
          placeholder={placeholder}
          {...register('text', { onChange: debounce(handleSubmit(onChange), 275) })}
          isInvalid={!!errors.text}
        />
        <InputRightElement pointerEvents="none" color="gray.500" fontSize="lg">
          <MdSearch />
        </InputRightElement>
      </InputGroup>
    </form>
  )
}

export default SearchInput
