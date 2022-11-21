import { Checkbox, FormControl, FormLabel, VStack } from '@chakra-ui/react'
import { FullyCenteredSpinner, SimpleBox } from 'components/app'
import { usePaymentMethods } from 'hooks'
import { Controller, useFormContext } from 'react-hook-form'

export const ArqByPayMethodFilters = () => {
  const { paymentMethods } = usePaymentMethods()
  const { control } = useFormContext()

  return (
    <SimpleBox>
      <FormControl>
        <FormLabel>Métodos de pago</FormLabel>
        {paymentMethods ? (
          <VStack align="flex-start">
            <Controller
              name="paymentMethods"
              control={control}
              render={({ field }) => (
                <>
                  {paymentMethods.map((pm) => (
                    <Checkbox
                      key={pm.id}
                      {...field}
                      value={pm.id}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...field.value, pm.id])
                        } else {
                          field.onChange(field.value.filter((v: number) => v !== pm.id))
                        }
                      }}
                    >
                      {pm.name}
                    </Checkbox>
                  ))}
                </>
              )}
            />
          </VStack>
        ) : (
          <FullyCenteredSpinner />
        )}
      </FormControl>
    </SimpleBox>
  )
}
