import { Alert, Checkbox, FormControl, FormLabel, VStack } from '@chakra-ui/react'
import { FullyCenteredSpinner, SimpleBox } from 'components/app'
import { usePaymentMethods } from 'hooks'
import { Controller, useFormContext } from 'react-hook-form'
import { z } from 'zod'
import { ReportType } from './reportTypes'

export const ArqByPayMethodFilters = () => {
  const { paymentMethods, error, isLoading } = usePaymentMethods()
  const cantReadPaymentMethods = error?.statusCode === 403
  const { control } = useFormContext<z.infer<ReportType['arqByPayMethod']['schema']>>()

  return (
    <SimpleBox>
      <FormControl>
        <FormLabel>Métodos de pago</FormLabel>
        {cantReadPaymentMethods && (
          <Alert status="error">No tiene permiso para leer métodos de pago</Alert>
        )}
        {paymentMethods && (
          <VStack align="flex-start">
            <Controller
              name="paymentMethod"
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
        )}
        {isLoading && <FullyCenteredSpinner />}
      </FormControl>
    </SimpleBox>
  )
}
