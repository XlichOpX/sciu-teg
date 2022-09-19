import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  SimpleGrid,
  VStack
} from '@chakra-ui/react'
import { Layout } from 'components/settings'
import { NextPageWithLayout } from 'pages/_app'

const GeneralSettings: NextPageWithLayout = () => {
  return (
    <>
      <Heading as="h2" size="md" mb={4}>
        Datos de la Institución
      </Heading>

      <VStack as="form" align="stretch" gap={4}>
        <SimpleGrid columns={[1, 2]} gap={4}>
          <FormControl>
            <FormLabel>Nombre</FormLabel>
            <Input />
          </FormControl>

          <FormControl>
            <FormLabel>RIF</FormLabel>
            <Input />
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <FormLabel>Dirección</FormLabel>
          <Input />
        </FormControl>

        <SimpleGrid columns={[1, 2]} gap={4}>
          <FormControl>
            <FormLabel>Zona</FormLabel>
            <Input />
          </FormControl>

          <FormControl>
            <FormLabel>Teléfono</FormLabel>
            <Input />
          </FormControl>
        </SimpleGrid>

        <Button colorScheme="blue">Guardar cambios</Button>
      </VStack>
    </>
  )
}

GeneralSettings.getLayout = (page) => <Layout title="General">{page}</Layout>

export default GeneralSettings
