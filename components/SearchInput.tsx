import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { InputGroup, Input, InputRightElement } from '@chakra-ui/react'
import { MdSearch } from 'react-icons/md'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({ text: z.string() })
type Input = z.infer<typeof schema>

function SearchInput({
  placeholder,
  onSubmit = () => null
}: {
  placeholder: string
  onSubmit?: SubmitHandler<Input>
}) {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<Input>({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputGroup>
        <Input placeholder={placeholder} {...register('text')} isInvalid={!!errors.text} />
        <InputRightElement pointerEvents="none" color="gray.500" fontSize="lg">
          <MdSearch />
        </InputRightElement>
      </InputGroup>
      <button hidden type="submit" disabled={isSubmitting}></button>
    </form>
  )
}

export default SearchInput
