import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { z, ZodTypeAny } from 'zod'

export const FiltersForm = <T extends ZodTypeAny>({
  schema,
  defaultValues = {},
  filters = () => <></>,
  onSubmit,
  id
}: {
  schema?: T
  defaultValues?: z.infer<T>
  onSubmit: SubmitHandler<z.infer<T>>
  filters?: () => JSX.Element
  id: string
}) => {
  const formhook = useForm<z.infer<T>>({
    resolver: zodResolver(schema ?? z.object({})),
    defaultValues
  })

  const Filters = filters

  return (
    <FormProvider {...formhook}>
      <form onSubmit={formhook.handleSubmit(onSubmit)} id={id}>
        {<Filters />}
      </form>
    </FormProvider>
  )
}
