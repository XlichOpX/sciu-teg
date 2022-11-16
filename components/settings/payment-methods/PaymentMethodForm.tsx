import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Text,
  VStack
} from '@chakra-ui/react'
import { Select as RSelect } from 'chakra-react-select'
import { FullyCenteredSpinner } from 'components/app'
import { InputArrayHeader } from 'components/app/InputArrayHeader'
import { useCurrencies } from 'hooks'
import { Controller, SubmitHandler, useFieldArray, UseFormReturn } from 'react-hook-form'
import { PaymentMethodCreateInput } from 'types/paymentMethod'

export type PaymentMethodFormSubmitHandler = SubmitHandler<PaymentMethodCreateInput>

export const PaymentMethodForm = ({
  id,
  onSubmit,
  formHook,
  resetOnSubmit = true
}: {
  id: string
  onSubmit: PaymentMethodFormSubmitHandler
  formHook: UseFormReturn<PaymentMethodCreateInput>
  resetOnSubmit?: boolean
}) => {
  const { currencies } = useCurrencies()

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    control
  } = formHook

  const { fields, append, remove } = useFieldArray({ name: 'metaPayment', control })

  if (!currencies) return <FullyCenteredSpinner />

  return (
    <VStack
      as="form"
      onSubmit={handleSubmit(async (data) => {
        await onSubmit(data)
        resetOnSubmit && reset()
      })}
      id={id}
      noValidate
      gap={3}
      align="stretch"
    >
      <FormControl isInvalid={!!errors.name} isRequired>
        <FormLabel>Nombre</FormLabel>
        <Input {...register('name')} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.description} isRequired>
        <FormLabel>Description</FormLabel>
        <Input {...register('description')} />
        <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors.currencies} isRequired>
        <FormLabel>Monedas</FormLabel>
        <Controller
          name="currencies"
          control={control}
          render={({ field: { name, ref, onBlur, onChange, value } }) => (
            <RSelect
              isMulti
              name={name}
              ref={ref}
              onBlur={onBlur}
              onChange={(nv) => onChange(nv.map((c) => ({ id: c.id })))}
              options={currencies}
              value={value}
              getOptionLabel={(o) => {
                const currency = currencies.find((c) => c.id === o.id)
                if (!currency) return ''
                return `${currency.name} - ${currency.symbol}`
              }}
              getOptionValue={(o) => {
                const currency = currencies.find((c) => c.id === o.id)
                if (!currency) return ''
                return currency.id.toString()
              }}
              placeholder="Seleccionar monedas"
              noOptionsMessage={() => 'Sin resultados'}
            />
          )}
        />
        <FormErrorMessage>{errors.currencies?.message}</FormErrorMessage>
      </FormControl>

      <InputArrayHeader
        title="Datos adicionales"
        fieldsLength={fields.length}
        onAdd={() => append({ name: '', fieldType: 'string' })}
        onRemove={() => remove(fields.length - 1)}
        minItems={0}
      />

      {fields.map((f, i) => (
        <SimpleGrid columns={[1, 2]} gap={3} key={f.id}>
          <FormControl isInvalid={!!errors.metaPayment?.[i]?.name} isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input {...register(`metaPayment.${i}.name`)} />
            <FormErrorMessage>{errors.metaPayment?.[i]?.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.metaPayment?.[i]?.type} isRequired>
            <FormLabel>Tipo</FormLabel>
            <Select {...register(`metaPayment.${i}.fieldType`)}>
              <option value="string">Texto</option>
              <option value="date">Fecha</option>
            </Select>
            <FormErrorMessage>{errors.metaPayment?.[i]?.fieldType?.message}</FormErrorMessage>
          </FormControl>
        </SimpleGrid>
      ))}

      {fields.length === 0 && (
        <Text textAlign="center" fontSize="sm">
          Puede agregar datos adicionales que el método de pago requiera. Por ejemplo: N° de
          Referencia.
        </Text>
      )}
    </VStack>
  )
}
