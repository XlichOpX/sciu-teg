import { Button, Flex, Heading, VisuallyHidden } from '@chakra-ui/react'
import { BsPlusLg, BsXLg } from 'react-icons/bs'

export const InputArrayHeader = ({
  onAdd,
  onRemove,
  fieldsLength,
  title
}: {
  onAdd: () => void
  onRemove: () => void
  fieldsLength: number
  title: string
}) => {
  return (
    <Flex justifyContent="space-between">
      <Heading as="h3" size="sm" my={4}>
        {title}
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
