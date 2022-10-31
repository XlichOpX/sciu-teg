import {
  Divider,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid
} from '@chakra-ui/react'
import { useConversions, usePaymentMethods } from 'hooks'
import { Fragment, useEffect } from 'react'
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
    watch,
    setValue
  } = formHook

  const { paymentMethods } = usePaymentMethods()
  const { latestConversion } = useConversions()

  const currentMethodId = watch(`charges.${chargeIndex}.paymentMethod.id`)
  const currentMethod = paymentMethods?.find((pm) => pm.id === currentMethodId)

  useEffect(() => {
    setValue(
      `charges.${chargeIndex}.paymentMethod.metaPayment`,
      currentMethod?.metaPayment?.map(({ name, fieldType }) => ({
        value: '',
        name,
        fieldType
      }))
    )
  }, [currentMethod, setValue, chargeIndex])

  if (!paymentMethods || !latestConversion) return null

  return (
    <>
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
          <InputGroup>
            <InputLeftElement pointerEvents="none" color="gray.300">
              $
            </InputLeftElement>
            <Input
              type="number"
              {...register(`charges.${chargeIndex}.amount`, {
                valueAsNumber: true
              })}
              placeholder="Monto"
            />
          </InputGroup>
          <FormErrorMessage>
            {errors.charges && errors.charges[chargeIndex]?.amount?.message}
          </FormErrorMessage>
        </FormControl>

        {currentMethod?.metaPayment?.map((mp, i) => (
          <Fragment key={i}>
            <FormControl
              isRequired
              isInvalid={
                !!errors.charges?.[chargeIndex]?.paymentMethod?.metaPayment?.[i]?.value?.message
              }
            >
              <Input
                defaultValue=""
                type={mp.fieldType === 'date' ? 'date' : 'text'}
                {...register(`charges.${chargeIndex}.paymentMethod.metaPayment.${i}.value`)}
                placeholder={mp.name}
              />
              <FormErrorMessage>
                {errors.charges?.[chargeIndex]?.paymentMethod?.metaPayment?.[i]?.value?.message}
              </FormErrorMessage>
            </FormControl>

            <input
              hidden
              defaultValue={mp.name}
              {...register(`charges.${chargeIndex}.paymentMethod.metaPayment.${i}.name`)}
            />

            <input
              hidden
              defaultValue={mp.fieldType}
              {...register(`charges.${chargeIndex}.paymentMethod.metaPayment.${i}.fieldType`)}
            />
          </Fragment>
        ))}

        <input
          hidden
          defaultValue={latestConversion.id}
          {...register(`charges.${chargeIndex}.paymentMethod.conversion`, { valueAsNumber: true })}
        />
      </SimpleGrid>
      <Divider my={2} />
    </>
  )
}
