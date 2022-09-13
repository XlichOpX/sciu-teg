import { Button, Container, Heading, useToast } from '@chakra-ui/react'
import { BaseLayout } from 'components'
import Head from 'next/head'
import { NextPageWithLayout } from './_app'

const Home: NextPageWithLayout = () => {
  const toast = useToast()
  return (
    <>
      <Head>
        <title>SCIU - TEG</title>
        <meta
          name="description"
          content="Sistema de Cobranzas para una Institución Universitaria"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="container.xl" as="main" py={4}>
        <Heading as="h1" mb={4}>
          SCIU - TEG
        </Heading>

        <p>
          Aquí estaremos desarrollando el Sistema de Gestión de Cobranzas para una Institución
          Universitaria, nuestro proyecto de Tesis
        </p>

        <Button
          colorScheme="blue"
          mt={4}
          onClick={() => toast({ description: '¡Sí, criminal!', status: 'success' })}
        >
          ¡Criminal!
        </Button>
      </Container>
    </>
  )
}

Home.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Home
