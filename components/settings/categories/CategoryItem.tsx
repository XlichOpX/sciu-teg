import { Text } from '@chakra-ui/react'
import { Category } from '@prisma/client'
import { SimpleBox } from 'components'
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
}) => (
  <SimpleBox pos="relative">
    <EditCategoryModal defaultValues={category} onSubmit={onUpdate} onDelete={onDelete} />
    <Text fontWeight="bold">{category.name}</Text>
  </SimpleBox>
)
