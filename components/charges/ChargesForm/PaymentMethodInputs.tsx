import { FormControl, FormErrorMessage, Input, Select, SimpleGrid } from '@chakra-ui/react'
import { useConversions, usePaymentMethods } from 'hooks'
import { UseFormReturn } from 'react-hook-form'
import { ChargesFormData } from '.'

export const PaymentMethodInputs = ({
  formHook,
  chargeIndex
}: {
  formHook: UseFormReturn<ChargesFormData>
  chargeIndex: number
}) => {
  const {
    register,
    formState: { errors },
    trigger
  } = formHook

  const { paymentMethods } = usePaymentMethods()
  const { latestConversion } = useConversions()

  if (!paymentMethods || !latestConversion) return null

  return (
    <SimpleGrid columns={[1, 2]} gap={4}>
      <FormControl>
        <Select {...register(`charges.${chargeIndex}.paymentMethod.id`, { valueAsNumber: true })}>
          {paymentMethods?.map((pm) => (
            <option key={pm.id} value={pm.id}>
              {pm.currency.symbol} - {pm.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl isInvalid={!!(errors.charges && errors.charges[chargeIndex]?.amount)}>
        <Input
          type="number"
          {...register(`charges.${chargeIndex}.amount`, {
            valueAsNumber: true,
            onChange: () => trigger('charges')
          })}
          placeholder="Monto"
        />
        <FormErrorMessage>
          {errors.charges && errors.charges[chargeIndex]?.amount?.message}
        </FormErrorMessage>
      </FormControl>

      <input
        hidden
        defaultValue={latestConversion.id}
        {...register(`charges.${chargeIndex}.paymentMethod.conversion`, { valueAsNumber: true })}
      />
    </SimpleGrid>
  )
}
