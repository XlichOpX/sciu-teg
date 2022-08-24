import {
  Grid,
  GridItem,
  Heading,
  InputGroup,
  Input,
  InputRightElement,
  Divider
} from '@chakra-ui/react'
import { MdSearch } from 'react-icons/md'

export default function Header() {
  return (
    <>
      <Grid templateColumns={['repeat(2, 1fr)', null, 'repeat(3, 1fr)']}>
        <GridItem colSpan={[1, null, 2]}>
          <Heading as="h1" mb={4}>
            Cobros
          </Heading>
        </GridItem>

        <GridItem colSpan={1}>
          <InputGroup>
            <Input placeholder="Cédula" />
            <InputRightElement pointerEvents="none" color="gray.500" fontSize="lg">
              <MdSearch />
            </InputRightElement>
          </InputGroup>
        </GridItem>
      </Grid>
      <Divider mb={4} />
    </>
  )
}
