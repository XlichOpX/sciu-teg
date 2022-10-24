import { FormControl, Input, Select, SimpleGrid } from '@chakra-ui/react'
import { useConversions, usePaymentMethods } from 'hooks'
import { UseFormReturn } from 'react-hook-form'
import { receiptCreateSchemaInput } from 'schema/receiptSchema'
import { z } from 'zod'

const chargesFormSchema = receiptCreateSchemaInput.pick({ charges: true })

export type ChargesFormData = z.infer<typeof chargesFormSchema>

export const ChargesForm = ({ formHook }: { formHook: UseFormReturn<ChargesFormData> }) => {
  const { paymentMethods } = usePaymentMethods()
  const { latestConversion } = useConversions()

  const { handleSubmit, register } = formHook

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <SimpleGrid columns={[1, 2]} gap={4}>
        <FormControl>
          <Select
            defaultValue={1}
            {...register('charges.0.paymentMethod.id', { valueAsNumber: true })}
          >
            {paymentMethods?.map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.currency.symbol} - {pm.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <Input
            type="number"
            defaultValue={0}
            {...register('charges.0.amount', { valueAsNumber: true })}
            placeholder="Monto"
          />
        </FormControl>
      </SimpleGrid>

      <input
        hidden
        {...register('charges.0.paymentMethod.conversion', {
          valueAsNumber: true,
          value: latestConversion?.id
        })}
      />
    </form>
  )
}
