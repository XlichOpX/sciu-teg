import { Divider, Flex, SimpleGrid } from '@chakra-ui/react'
import { SearchInput } from 'components/app'
import { SettingsLayout } from 'components/settings'
import { CategoryItem, CreateCategoryModal } from 'components/settings/categories'
import { useCategories } from 'hooks'
import { NextPageWithLayout } from 'pages/_app'

const CategorySettings: NextPageWithLayout = () => {
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories()
  return (
    <>
      <Flex direction={['column', 'row']} align="stretch" justify="space-between" gap={4}>
        <SearchInput placeholder="Buscar categorías" />
        <CreateCategoryModal onSubmit={createCategory} />
      </Flex>
      <Divider my={4} />

      <SimpleGrid minChildWidth="2xs" gap={4}>
        {categories?.map((c) => (
          <CategoryItem
            key={c.id}
            category={c}
            onUpdate={(data) => updateCategory(c.id, data)}
            onDelete={() => deleteCategory(c.id)}
          />
        ))}
      </SimpleGrid>
    </>
  )
}

CategorySettings.getLayout = (page) => <SettingsLayout title="Categorías">{page}</SettingsLayout>

export default CategorySettings