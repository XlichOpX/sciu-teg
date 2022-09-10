import { Flex, Button, VisuallyHidden } from '@chakra-ui/react'

function Pagination() {
  return (
    <Flex my={4} gap={2} justifyContent="center">
      <Button>
        <VisuallyHidden>Página anterior</VisuallyHidden>←
      </Button>
      <Button>1</Button>
      <Button>2</Button>
      <Button>3</Button>
      <Button>
        <VisuallyHidden>Página siguiente</VisuallyHidden>→
      </Button>
    </Flex>
  )
}

export default Pagination
