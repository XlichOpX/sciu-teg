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
import { NextPageWithLayout } from '../_app'

const Login: NextPageWithLayout = () => {
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

        <Box as="form" w="full">
          <FormControl mb={4}>
            <FormLabel>Usuario</FormLabel>
            <Input />
          </FormControl>

          <FormControl mb={4}>
            <FormLabel>Contraseña</FormLabel>
            <Input />
          </FormControl>

          <Button colorScheme="blue" width="full">
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
