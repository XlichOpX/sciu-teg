import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  useToast
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from 'hooks'
import { SubmitHandler, useForm } from 'react-hook-form'
import { updatePassword } from 'services/auth'
import { z } from 'zod'

const newPasswordFormSchema = z
  .object({
    password: z.string().min(8),
    passwordConfirm: z.string().min(8)
  })
  .refine(({ password, passwordConfirm }) => password === passwordConfirm, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirm']
  })

type NewPasswordFormData = z.infer<typeof newPasswordFormSchema>

export const NewPasswordForm = ({ username, userId }: { username: string; userId: number }) => {
  const toast = useToast()
  const { logout } = useAuth()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: { passwordConfirm: '', password: '' }
  })

  const onSubmit: SubmitHandler<NewPasswordFormData> = async (data) => {
    try {
      await updatePassword(userId, data)
      await logout()
      toast({ status: 'success', description: 'Inicie sesión con su nueva contraseña' })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: 'error', description: 'Ocurrió un error al actualizar su contraseña' })
      }
    }
  }

  return (
    <Box as="form" w="full" onSubmit={handleSubmit(onSubmit)}>
      <Text mb={4}>Hola, {username}. Escriba su nueva contraseña a continuación:</Text>
      <FormControl mb={4} isInvalid={!!errors.password}>
        <FormLabel>Nueva contraseña</FormLabel>
        <Input
          {...register('password', { deps: ['passwordConfirm'] })}
          type="password"
          placeholder="••••••••"
        />
        <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4} isInvalid={!!errors.passwordConfirm}>
        <FormLabel>Confirmar nueva contraseña</FormLabel>
        <Input {...register('passwordConfirm')} type="password" placeholder="••••••••" />
        <FormErrorMessage>{errors.passwordConfirm?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" colorScheme="blue" width="full" disabled={isSubmitting}>
        Cambiar contraseña
      </Button>
    </Box>
  )
}
