import { Button, Flex, Heading, VisuallyHidden } from '@chakra-ui/react'
import { BsPlusLg, BsXLg } from 'react-icons/bs'

export const InputArrayHeader = ({
  onAdd,
  onRemove,
  fieldsLength,
  title,
  minItems = 1
}: {
  onAdd: () => void
  onRemove: () => void
  fieldsLength: number
  title: string
  minItems?: number
}) => {
  return (
    <Flex alignItems="center" my={3}>
      <Heading as="h3" size="sm" mr="auto">
        {title}
      </Heading>

      {fieldsLength > minItems && (
        <Button variant="outline" colorScheme="red" size="sm" onClick={onRemove} mr={3}>
          <VisuallyHidden>Eliminar</VisuallyHidden>
          <BsXLg />
        </Button>
      )}

      <Button variant="outline" colorScheme="blue" size="sm" onClick={onAdd}>
        <VisuallyHidden>Agregar</VisuallyHidden>
        <BsPlusLg />
      </Button>
    </Flex>
  )
}
