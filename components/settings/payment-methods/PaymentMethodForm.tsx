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
import { InputArrayHeader } from 'components/app/InputArrayHeader'
import { useCurrencies } from 'hooks'
import { SubmitHandler, useFieldArray, UseFormReturn } from 'react-hook-form'
import { PaymentMethodInput } from 'types/paymentMethod'

export type PaymentMethodFormSubmitHandler = SubmitHandler<PaymentMethodInput>

export const PaymentMethodForm = ({
  id,
  onSubmit,
  formHook,
  resetOnSubmit = true
}: {
  id: string
  onSubmit: PaymentMethodFormSubmitHandler
  formHook: UseFormReturn<PaymentMethodInput>
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

      <FormControl isInvalid={!!errors.currencyId} isRequired>
        <FormLabel>Moneda</FormLabel>
        <Select {...register('currencyId', { valueAsNumber: true })}>
          {currencies?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} - {c.symbol}
            </option>
          ))}
        </Select>
        <FormErrorMessage>{errors.currencyId?.message}</FormErrorMessage>
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
