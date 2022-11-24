import { Alert, FormControl, FormHelperText, Stack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FullyCenteredSpinner } from 'components/app'
import { InputArrayHeader } from 'components/app/InputArrayHeader'
import { useLatestConversions, usePaymentMethods } from 'hooks'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { receiptCreateSchemaInput } from 'schema/receiptSchema'
import { getDiffLabel } from 'utils/getDiffLabel'
import { round } from 'utils/round'
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
  const { paymentMethods, error: payMethodsError } = usePaymentMethods()
  const { latestConversions, error: conversionsError } = useLatestConversions()

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
        { message: 'La suma de los montos debe ser igual al total', path: ['charges.amount'] }
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
  const amountDiff = round(totalAmount - maxAmount)

  const cantReadPayMethods = payMethodsError?.statusCode === 403
  const cantReadConversions = conversionsError?.statusCode === 403

  if (cantReadPayMethods || cantReadConversions)
    return (
      <Alert status="error">
        Necesita permiso para leer métodos de pago y tasas de cambio para poder realizar cobros
      </Alert>
    )

  if (!latestConversions || !paymentMethods) return <FullyCenteredSpinner />

  return (
    <>
      <InputArrayHeader
        title="Métodos de pago"
        onAdd={() =>
          append({
            amount: 1,
            currencyId: paymentMethods[0].currencies[0].id,
            paymentMethod: {
              id: paymentMethods[0].id
            }
          })
        }
        onRemove={() => remove(fields.length - 1)}
        fieldsLength={fields.length}
      />

      <form
        id={id}
        onSubmit={handleSubmit(onSubmit, (errors) => console.log({ errors }))}
        noValidate
      >
        <FormControl as={Stack} gap={1} isInvalid={!!errors.charges}>
          {fields.map((f, i) => (
            <PaymentMethodInputs
              key={f.id}
              chargeIndex={i}
              formHook={formHook}
              differenceWithTotal={totalAmount - maxAmount}
            />
          ))}
          {amountDiff !== 0 && (
            <FormHelperText textAlign="center" color="red.300" fontSize="md" fontWeight="bold">
              {getDiffLabel(amountDiff)}: $ {Math.abs(round(amountDiff))}
            </FormHelperText>
          )}
        </FormControl>
      </form>
    </>
  )
}
