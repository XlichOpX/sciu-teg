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
import { SubmitHandler, useForm } from 'react-hook-form'
import { confirmAnswers, SecretQuestions } from 'services/auth'
import { z } from 'zod'

const secretsFormSchema = z.object({
  username: z.string().min(1),
  id: z.number(),
  answerOne: z.string().min(1),
  answerTwo: z.string().min(1),
  answerThree: z.string().min(1)
})

type SecretsFormData = z.infer<typeof secretsFormSchema>

export const SecretsForm = ({
  userId,
  username,
  questions,
  onConfirm
}: {
  userId: number
  username: string
  questions: SecretQuestions
  onConfirm: (canChangePassword: boolean) => void
}) => {
  const toast = useToast()

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<SecretsFormData>({
    resolver: zodResolver(secretsFormSchema),
    defaultValues: { username, id: userId }
  })

  const onSubmit: SubmitHandler<SecretsFormData> = async (data) => {
    try {
      await confirmAnswers(data)
      onConfirm(true)
      toast({ status: 'success', description: 'Respuestas correctas' })
    } catch (error) {
      if (error instanceof Error) {
        toast({ status: 'error', description: 'Respuestas incorrectas' })
      }
      onConfirm(false)
    }
  }

  return (
    <Box as="form" w="full" onSubmit={handleSubmit(onSubmit)}>
      <FormControl mb={4} isInvalid={!!errors.answerOne}>
        <FormLabel>{questions.questionOne}</FormLabel>
        <Input {...register('answerOne')} type="password" placeholder="Respuesta" />
        <FormErrorMessage>{errors.answerOne?.message}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4} isInvalid={!!errors.answerTwo}>
        <FormLabel>{questions.questionTwo}</FormLabel>
        <Input {...register('answerTwo')} type="password" placeholder="Respuesta" />
        <FormErrorMessage>{errors.answerTwo?.message}</FormErrorMessage>
      </FormControl>

      <FormControl mb={4} isInvalid={!!errors.answerThree}>
        <FormLabel>{questions.questionThree}</FormLabel>
        <Input {...register('answerThree')} type="password" placeholder="Respuesta" />
        <FormErrorMessage>{errors.answerThree?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" colorScheme="blue" width="full" isLoading={isSubmitting}>
        Confirmar respuestas
      </Button>
    </Box>
  )
}
