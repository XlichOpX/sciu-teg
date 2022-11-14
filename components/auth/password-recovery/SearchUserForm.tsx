import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { HttpError } from 'lib/http-error'
import { SubmitHandler, useForm } from 'react-hook-form'
import { getRecoveryCookie, getUserSecret, GetUserSecretResponse } from 'services/auth'
import { z } from 'zod'

const searchUserFormSchema = z.object({
  username: z.string().min(1)
})

type SearchUserFormData = z.infer<typeof searchUserFormSchema>
type SearchUserFormAfterSubmit = (data: GetUserSecretResponse) => void

export const SearchUserForm = ({
  afterSubmit,
  disabled
}: {
  afterSubmit: SearchUserFormAfterSubmit
  disabled: boolean
}) => {
  const toast = useToast()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<SearchUserFormData>({
    resolver: zodResolver(searchUserFormSchema),
    defaultValues: { username: '' }
  })

  const onSubmit: SubmitHandler<SearchUserFormData> = async (data) => {
    try {
      await getRecoveryCookie(data.username)
      const userRecovery = await getUserSecret(data.username)
      afterSubmit(userRecovery)
      toast({ status: 'success', description: `Usuario "${data.username}" encontrado` })
    } catch (error) {
      if (error instanceof HttpError) {
        toast({
          status: 'error',
          description:
            error.statusCode === 404
              ? 'Usuario no encontrado'
              : 'Ocurrió un error al obtener las preguntas del usuario'
        })
      }
    }
  }

  return (
    <Box as="form" w="full" onSubmit={handleSubmit(onSubmit)}>
      <FormControl mb={4} id="username" isInvalid={!!errors.username} isReadOnly={disabled}>
        <FormLabel>Usuario</FormLabel>
        <Input {...register('username')} />
        <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
      </FormControl>

      <Button
        colorScheme="blue"
        width="full"
        type="submit"
        isLoading={isSubmitting}
        disabled={disabled}
      >
        Recuperar acceso
      </Button>
    </Box>
  )
}
