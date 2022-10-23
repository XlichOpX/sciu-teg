import { PersonSelect } from 'components/app/PersonSelect'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

export const personSelectFormSchema = z.object({
  personId: z
    .number({
      required_error: 'Seleccione una persona'
    })
    .positive()
})
export type PersonSelectFormData = z.infer<typeof personSelectFormSchema>

export const PersonSelectForm = ({
  formHook,
  onSubmit,
  id
}: {
  formHook: UseFormReturn<PersonSelectFormData>
  onSubmit: SubmitHandler<PersonSelectFormData>
  id: string
}) => {
  const { handleSubmit } = formHook

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)}>
      <PersonSelect formHook={formHook} />
    </form>
  )
}
