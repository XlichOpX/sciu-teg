import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { InputGroup, Input, InputRightElement } from '@chakra-ui/react'
import { MdSearch } from 'react-icons/md'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { debounce } from 'utils/debounce'

const schema = z.object({ text: z.string() })
type Input = z.infer<typeof schema>

function SearchInput({
  placeholder,
  onChange = () => null
}: {
  placeholder: string
  onChange?: SubmitHandler<Input>
}) {
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<Input>({ resolver: zodResolver(schema) })

  return (
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
  )
}

export default SearchInput
