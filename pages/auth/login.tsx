import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link
} from '@chakra-ui/react'
import Head from 'next/head'
import NextLink from 'next/link'
import { ChangeEvent, FormEvent, useState } from 'react'
import { NextPageWithLayout } from '../_app'
import { useRouter } from 'next/router'

const Login: NextPageWithLayout = () => {
  const [statePassword, setPassword] = useState('')
  const [stateUsername, setUsername] = useState('')

  const router = useRouter()
  const { query: { redirect }} = router

  const handleUserInput = (e: ChangeEvent) => {
    setUsername(e.target.value)
  }
  const handlePassInput = (e: ChangeEvent) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e: FormEvent) => {
    const username = stateUsername
    const password = statePassword

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })
    if (res.ok) {
      router.push(new URL(redirect as string), undefined, {shallow : false})
    }
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
          SCIU
          <Divider />
          Iniciar sesión
        </Heading>

        <Box as="form" w="full" onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>Usuario</FormLabel>
            <Input onChange={handleUserInput} />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Contraseña</FormLabel>
            <Input type="password" onChange={handlePassInput} />
          </FormControl>

          <Button colorScheme="blue" width="full" onClick={handleSubmit}>
            Iniciar sesión
          </Button>
        </Box>

        <NextLink href="/auth/recuperar-usuario" passHref>
          <Link>¿Ha olvidado su contraseña?</Link>
        </NextLink>
      </Flex>
    </>
  )
}

export default Login
