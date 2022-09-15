import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input
} from '@chakra-ui/react'
import Head from 'next/head'
import { NextPageWithLayout } from '../_app'

const UserRecovery: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Recuperar usuario - SCIU</title>
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
          Recuperar acceso
        </Heading>

        <Box as="form" w="full">
          <FormControl mb={4}>
            <FormLabel>Usuario</FormLabel>
            <Input />
          </FormControl>

          <Button colorScheme="blue" width="full">
            Buscar usuario
          </Button>
        </Box>

        <NewPasswordForm />
      </Flex>
    </>
  )
}

export default UserRecovery

function NewPasswordForm() {
  return (
    <Box as="form" w="full">
      <FormControl mb={4}>
        <FormLabel>Pregunta #1</FormLabel>
        <Input placeholder="Respuesta" />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Pregunta #2</FormLabel>
        <Input placeholder="Respuesta" />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Pregunta #3</FormLabel>
        <Input placeholder="Respuesta" />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Nueva contraseña</FormLabel>
        <Input type="password" />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Confirmar nueva contraseña</FormLabel>
        <Input type="password" />
      </FormControl>

      <Button colorScheme="blue" width="full">
        Cambiar contraseña
      </Button>
    </Box>
  )
}
