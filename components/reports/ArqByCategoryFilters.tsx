import { FormControl, FormLabel } from '@chakra-ui/react'
import { Select as RSelect } from 'chakra-react-select'
import { SimpleBox } from 'components/app'
import { useCategories } from 'hooks'
import { Controller, useFormContext } from 'react-hook-form'

export const ArqByCategoryFilters = () => {
  const { categories } = useCategories()
  const { control } = useFormContext()

  return (
    <SimpleBox>
      <FormControl>
        <FormLabel>Categorías</FormLabel>
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <RSelect
              {...field}
              value={categories?.filter((c) => field.value.includes(c.id))}
              onChange={(val) => field.onChange(val.map((c) => c.id))}
              placeholder="Seleccionar categorías"
              isMulti
              options={categories}
              getOptionLabel={(o) => o.name}
              getOptionValue={(o) => o.id.toString()}
              closeMenuOnSelect={false}
            />
          )}
        />
      </FormControl>
    </SimpleBox>
  )
}
