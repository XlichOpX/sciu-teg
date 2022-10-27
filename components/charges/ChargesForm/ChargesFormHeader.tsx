import { Button, Flex, Heading, VisuallyHidden } from '@chakra-ui/react'
import { BsPlusLg, BsXLg } from 'react-icons/bs'

export const ChargesFormHeader = ({
  onAdd,
  onRemove,
  fieldsLength
}: {
  onAdd: () => void
  onRemove: () => void
  fieldsLength: number
}) => {
  return (
    <Flex justifyContent="space-between">
      <Heading as="h3" size="sm" my={4}>
        Métodos de pago
      </Heading>

      <div>
        {fieldsLength > 1 && (
          <Button variant="outline" colorScheme="red" size="sm" onClick={onRemove} mr={3}>
            <VisuallyHidden>Eliminar</VisuallyHidden>
            <BsXLg />
          </Button>
        )}

        <Button variant="outline" colorScheme="blue" size="sm" onClick={onAdd}>
          <VisuallyHidden>Agregar</VisuallyHidden>
          <BsPlusLg />
        </Button>
      </div>
    </Flex>
  )
}
