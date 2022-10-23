import { Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import debounce from 'just-debounce'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { MdSearch } from 'react-icons/md'
import { z } from 'zod'

const schema = z.object({ text: z.string() })
export type SearchInput = z.infer<typeof schema>
export type SearchSubmitHandler = SubmitHandler<SearchInput>

export const SearchInput = ({
  placeholder,
  onChange = () => null,
  onSubmit = () => null
}: {
  placeholder: string
  onChange?: SearchSubmitHandler
  onSubmit?: SearchSubmitHandler
}) => {
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
