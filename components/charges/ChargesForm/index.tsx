import { FormControl, FormErrorMessage, FormHelperText, Stack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FullyCenteredSpinner } from 'components/app'
import { InputArrayHeader } from 'components/app/InputArrayHeader'
import { useConversions, usePaymentMethods } from 'hooks'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { receiptCreateSchemaInput } from 'schema/receiptSchema'
import { z } from 'zod'
import { PaymentMethodInputs } from './PaymentMethodInputs'

export const chargesFormSchema = receiptCreateSchemaInput.pick({ charges: true })
export type ChargesFormData = z.infer<typeof chargesFormSchema>

export const ChargesForm = ({
  maxAmount,
  id,
  onSubmit
}: {
  maxAmount: number
  id: string
  onSubmit: SubmitHandler<ChargesFormData>
}) => {
  const { paymentMethods } = usePaymentMethods()
  const { latestConversion } = useConversions()

  const formHook = useForm<ChargesFormData>({
    defaultValues: {
      charges: [
        {
          amount: maxAmount,
          paymentMethod: { id: 1 }
        }
      ]
    },
    resolver: zodResolver(
      chargesFormSchema.refine(
        (arg) => {
          const totalAmount = arg.charges.reduce((ac, c) => ac + Number(c.amount), 0)
          return !(totalAmount !== maxAmount)
        },
        { message: 'La suma de los montos debe ser igual al total', path: ['charges'] }
      )
    ),
    mode: 'onChange'
  })

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = formHook

  const { fields, append, remove } = useFieldArray({ control, name: 'charges' })
  const charges = watch('charges')
  const totalAmount = charges.reduce((ac, c) => ac + c.amount, 0)
  const amountDiff = totalAmount - maxAmount

  if (!latestConversion || !paymentMethods) return <FullyCenteredSpinner />

  return (
    <>
      <InputArrayHeader
        title="Métodos de pago"
        onAdd={() =>
          append({
            amount: 1,
            paymentMethod: {
              conversion: latestConversion.id,
              id: paymentMethods[0].id
            }
          })
        }
        onRemove={remove}
        fieldsLength={fields.length}
      />

      <form id={id} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormControl as={Stack} gap={1} isInvalid={!!errors.charges}>
          {fields.map((f, i) => (
            <PaymentMethodInputs key={f.id} chargeIndex={i} formHook={formHook} />
          ))}
          <FormErrorMessage justifyContent="center">{errors.charges?.message}</FormErrorMessage>
          {amountDiff && (
            <FormHelperText textAlign="center">Diferencia: {amountDiff}</FormHelperText>
          )}
        </FormControl>
      </form>
    </>
  )
}
