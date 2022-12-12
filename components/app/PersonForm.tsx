import { Stack } from '@chakra-ui/react'
import { PersonInputs } from 'components/app/PersonInputs'
import React from 'react'
import { personSchema } from 'schema/userSchema'
import { z } from 'zod'

export const personFormSchema = personSchema
export type PersonFormData = z.infer<typeof personFormSchema>

export const PersonForm = ({
  onSubmit,
  id
}: {
  onSubmit: React.FormEventHandler<HTMLFormElement>
  id: string
}) => {
  return (
    <form onSubmit={onSubmit} id={id} noValidate autoComplete="off">
      <Stack gap={2}>
        <PersonInputs />
      </Stack>
    </form>
  )
}
