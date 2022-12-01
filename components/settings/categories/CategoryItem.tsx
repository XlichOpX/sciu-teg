import { Divider, Flex, Text } from '@chakra-ui/react'
import { Category } from '@prisma/client'
import { SimpleBox } from 'components/app'
import { useAuth } from 'hooks'
import { EditCategoryModal } from './EditCategoryModal'

export const CategoryItem = ({ category }: { category: Category }) => {
  const { user } = useAuth()

  return (
    <SimpleBox>
      <Flex justifyContent="space-between">
        <Text fontWeight="bold">{category.name}</Text>
        {user?.permissions.includes('EDIT_CATEGORY') && <EditCategoryModal category={category} />}
      </Flex>
      <Divider my={2} />
      <Text>{category.description}</Text>
    </SimpleBox>
  )
}
