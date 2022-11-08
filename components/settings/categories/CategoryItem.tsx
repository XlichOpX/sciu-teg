import { Text } from '@chakra-ui/react'
import { Category } from '@prisma/client'
import { SimpleBox } from 'components/app'
import { useAuth } from 'hooks'
import { SubmitHandler } from 'react-hook-form'
import { CategoryInput } from 'types/category'
import { EditCategoryModal } from './EditCategoryModal'

export const CategoryItem = ({
  category,
  onDelete,
  onUpdate
}: {
  category: Category
  onUpdate: SubmitHandler<CategoryInput>
  onDelete: () => Promise<void>
}) => {
  const { user } = useAuth()

  return (
    <SimpleBox pos="relative">
      {user?.permissions.includes('EDIT_CATEGORY') && (
        <EditCategoryModal defaultValues={category} onSubmit={onUpdate} onDelete={onDelete} />
      )}
      <Text fontWeight="bold">{category.name}</Text>
    </SimpleBox>
  )
}
