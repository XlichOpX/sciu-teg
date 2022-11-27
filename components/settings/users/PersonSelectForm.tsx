import { PersonSelect } from 'components/app/PersonSelect'
import { HttpError } from 'lib/http-error'
import { SubmitHandler, UseFormReturn } from 'react-hook-form'
import { getUserById } from 'services/users'
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
          await getUserById(val)
          return false
        } catch (error) {
          if (error instanceof HttpError && error.statusCode === 404) {
            return true
          }
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
