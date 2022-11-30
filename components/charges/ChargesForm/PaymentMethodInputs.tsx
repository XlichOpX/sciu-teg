import {
  Divider,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  SimpleGrid
} from '@chakra-ui/react'
import { useLatestConversions, usePaymentMethods } from 'hooks'
import { Fragment, useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { getDiffLabel } from 'utils/getDiffLabel'
import { round } from 'utils/round'
import { ChargesFormData } from '.'

export const PaymentMethodInputs = ({
  formHook,
  chargeIndex,
  differenceWithTotal
}: {
  formHook: UseFormReturn<ChargesFormData>
  chargeIndex: number
  differenceWithTotal: number
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue
  } = formHook

  const { paymentMethods } = usePaymentMethods()
  const { latestConversions } = useLatestConversions()

  const currentMethodId = watch(`charges.${chargeIndex}.paymentMethod.id`)
  const currentMethod = paymentMethods?.find((pm) => pm.id === currentMethodId)

  const currentCurrencyId = watch(`charges.${chargeIndex}.currencyId`)
  const currentCurrency = currentMethod?.currencies?.find((c) => c.id === currentCurrencyId)

  const currentAmount = watch(`charges.${chargeIndex}.amount`)

  useEffect(() => {
    setValue(
      `charges.${chargeIndex}.paymentMethod.metaPayment`,
      currentMethod?.metaPayment?.map(({ name, fieldType }) => ({
        value: '',
        name,
        fieldType
      }))
    )

    if (currentMethod) {
      setValue(`charges.${chargeIndex}.currencyId`, currentMethod.currencies[0].id)
    }
  }, [currentMethod, setValue, chargeIndex])

  useEffect(() => {
    setValue(`charges.${chargeIndex}.amount`, 0)
  }, [currentCurrency, setValue, chargeIndex])

  if (!paymentMethods || !latestConversions) return null

  const conversion = latestConversions.find((lc) => lc.currency.id === currentCurrency?.id)
  const diff = conversion ? round(differenceWithTotal * conversion.value) : 0

  return (
    <>
      <SimpleGrid columns={[1, 2]} gap={4}>
        <FormControl>
          <Select {...register(`charges.${chargeIndex}.paymentMethod.id`, { valueAsNumber: true })}>
            {paymentMethods?.map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <Select
            {...register(`charges.${chargeIndex}.currencyId`, {
              valueAsNumber: true
            })}
          >
            {currentMethod?.currencies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - {c.symbol}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isInvalid={!!(errors.charges && errors.charges[chargeIndex]?.amount)}>
          <InputGroup>
            <InputLeftElement
              pointerEvents="none"
              _dark={{ color: 'gray.300' }}
              _light={{ color: 'gray.700' }}
            >
              {currentCurrency?.symbol}
            </InputLeftElement>
            <Input
              type="number"
              onFocus={(e) => e.currentTarget.select()}
              {...register(`charges.${chargeIndex}.amount`, {
                setValueAs: (value) => {
                  if (!currentCurrency) return +value
                  if (!conversion) return +value
                  return round(+value / conversion.value)
                }
              })}
              placeholder="Monto"
            />
          </InputGroup>
          <FormHelperText>
            Apróx. ${round(currentAmount)}
            {diff !== 0 && (
              <>
                {' '}
                | {getDiffLabel(diff)}: {currentCurrency?.symbol} {round(Math.abs(diff))}
              </>
            )}
          </FormHelperText>

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
      </SimpleGrid>
      <Divider my={2} />
    </>
  )
}
