import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Input,
  Select,
  SimpleGrid,
  Stack
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useConversions, usePaymentMethods } from 'hooks'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { receiptCreateSchemaInput } from 'schema/receiptSchema'
import { z } from 'zod'
import { ChargesFormHeader } from './ChargesFormHeader'

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

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
    trigger
  } = useForm<ChargesFormData>({
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

  const { fields, append, remove } = useFieldArray({ control, name: 'charges' })
  const charges = watch('charges')
  const totalAmount = charges.reduce((ac, c) => ac + c.amount, 0)
  const amountDiff = totalAmount - maxAmount

  if (!latestConversion || !paymentMethods) return null

  return (
    <>
      <ChargesFormHeader
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
            <SimpleGrid columns={[1, 2]} gap={4} key={f.id}>
              <FormControl>
                <Select {...register(`charges.${i}.paymentMethod.id`, { valueAsNumber: true })}>
                  {paymentMethods?.map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.currency.symbol} - {pm.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isInvalid={!!(errors.charges && errors.charges[i]?.amount)}>
                <Input
                  type="number"
                  {...register(`charges.${i}.amount`, {
                    valueAsNumber: true,
                    onChange: () => trigger('charges')
                  })}
                  placeholder="Monto"
                />
                <FormErrorMessage>
                  {errors.charges && errors.charges[i]?.amount?.message}
                </FormErrorMessage>
              </FormControl>

              <input
                hidden
                defaultValue={latestConversion.id}
                {...register(`charges.${i}.paymentMethod.conversion`, { valueAsNumber: true })}
              />
            </SimpleGrid>
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
