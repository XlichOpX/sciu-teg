import { PersonSelect } from 'components/app/PersonSelect'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { getPersonById } from 'services/persons'
import { z } from 'zod'

export const personSelectFormSchema = z.object({
  personId: z
    .number({
      required_error: 'Seleccione una persona'
    })
    .positive()
    .refine(
      async (val) => {
        try {
          return !(await getPersonById(val)).user
        } catch (error) {
          console.error(error)
        }
      },
      { message: 'Esta persona ya tiene un usuario' }
    )
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
