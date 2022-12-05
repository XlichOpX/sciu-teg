import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  useToast
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Logo } from 'components/app'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { NextPageWithLayout } from '../_app'

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(4)
})

type Inputs = z.infer<typeof schema>

const Login: NextPageWithLayout = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<Inputs>({ resolver: zodResolver(schema) })

  const router = useRouter()
  const {
    query: { redirect }
  } = router

  const toast = useToast()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'content-type': 'application/json' }
    })

    if (!res.ok) {
      toast({ status: 'error', description: 'Credenciales inválidas' })
      return
    }

    router.push(typeof redirect === 'string' ? redirect : '/')
  }

  return (
    <>
      <Head>
        <title>Iniciar sesión - SCIU</title>
      </Head>

      <Flex
        justifyContent="center"
        alignItems="center"
        mx="auto"
        w={['full', 'md']}
        h="100vh"
        p={4}
        direction="column"
        gap={6}
      >
        <Heading as="h1" textAlign="center" w="full">
          <Logo mx="auto" my={3} />
          <Divider />
          Iniciar sesión
        </Heading>

        <Box as="form" w="full" onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={4} isInvalid={!!errors.username}>
            <FormLabel>Usuario</FormLabel>
            <Input {...register('username')} />
            <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
          </FormControl>

          <FormControl mb={4} isInvalid={!!errors.password}>
            <FormLabel>Contraseña</FormLabel>
            <Input type="password" {...register('password')} />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>

          <Button colorScheme="blue" width="full" type="submit" isLoading={isSubmitting}>
            Iniciar sesión
          </Button>
        </Box>

        <NextLink href="/auth/recuperar-usuario">
          <Link as="span">¿Ha olvidado su contraseña?</Link>
        </NextLink>
      </Flex>
    </>
  )
}

export default Login
