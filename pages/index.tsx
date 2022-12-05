import { Container, Divider, Flex, Heading } from '@chakra-ui/react'
// import { SimpleBox } from 'components/app'
import { LatestConversions } from 'components/home/LatestConversions'
// import { MonthlySoldProducts } from 'components/home/MonthlySoldProducts'
import { SemesterIndicator } from 'components/home/SemesterIndicator'
import { BaseLayout } from 'components/layouts'
import { useAuth } from 'hooks'
import Head from 'next/head'
import { NextPageWithLayout } from './_app'

const Home: NextPageWithLayout = () => {
  const { user } = useAuth()

  if (!user) return null

  return (
    <>
      <Head>
        <title>Sistema de Cobranzas - IUJO</title>
        <meta
          name="description"
          content="Sistema de Cobranzas para una Institución Universitaria"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="container.xl" as="main" py={4}>
        <Heading as="h1" mb={4} textAlign="center">
          Sistema de Cobranzas - IUJO
        </Heading>

        {user.permissions.includes('READ_SEMESTER') && <SemesterIndicator />}
        <Divider my={4} />

        <Flex gap={8} alignItems="flex-start">
          {/* {user.permissions.includes('READ_REPORT') && (
            <SimpleBox shadow="md" p={4} w="78%">
              <MonthlySoldProducts />
            </SimpleBox>
          )} */}
          {user.permissions.includes('READ_CONVERSION') && <LatestConversions w="22%" />}
        </Flex>
      </Container>
    </>
  )
}

Home.getLayout = (page) => <BaseLayout>{page}</BaseLayout>

export default Home
