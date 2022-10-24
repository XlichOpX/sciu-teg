import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Stack,
  VisuallyHidden
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useConversions, usePaymentMethods } from 'hooks'
import { Fragment } from 'react'
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form'
import { BsPlusLg, BsXLg } from 'react-icons/bs'
import { receiptCreateSchemaInput } from 'schema/receiptSchema'
import { z } from 'zod'

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
    formState: { errors }
  } = useForm<ChargesFormData>({
    defaultValues: {
      charges: [
        {
          amount: maxAmount,
          paymentMethod: {
            id: 1
          }
        }
      ]
    },
    resolver: zodResolver(
      chargesFormSchema.refine(
        (arg) => {
          const totalAmount = arg.charges.reduce((ac, c) => ac + c.amount, 0)
          return !(totalAmount !== maxAmount)
        },
        { message: 'La suma de los montos debe ser igual al total', path: ['charges'] }
      )
    )
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'charges'
  })

  if (!latestConversion) return null

  return (
    <>
      <Flex justifyContent="space-between">
        <Heading as="h3" size="sm" my={4}>
          Métodos de pago
        </Heading>

        <div>
          {fields.length > 1 && (
            <Button
              variant="outline"
              colorScheme="red"
              size="sm"
              onClick={() => remove(fields.length - 1)}
              mr={3}
            >
              <VisuallyHidden>Eliminar</VisuallyHidden>
              <BsXLg />
            </Button>
          )}

          <Button
            variant="outline"
            colorScheme="blue"
            size="sm"
            onClick={() =>
              append({
                amount: 0,
                paymentMethod: {
                  conversion: latestConversion.id,
                  id: 1
                }
              })
            }
          >
            <VisuallyHidden>Agregar</VisuallyHidden>
            <BsPlusLg />
          </Button>
        </div>
      </Flex>

      <form id={id} onSubmit={handleSubmit(onSubmit)}>
        <FormControl as={Stack} gap={1} isInvalid={!!errors.charges}>
          {fields.map((f, i) => (
            <Fragment key={f.id}>
              <SimpleGrid columns={[1, 2]} gap={4}>
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
                    {...register(`charges.${i}.amount`, { valueAsNumber: true })}
                    placeholder="Monto"
                  />
                  <FormErrorMessage>
                    {errors.charges && errors.charges[i]?.amount?.message}
                  </FormErrorMessage>
                </FormControl>
              </SimpleGrid>

              <input
                hidden
                defaultValue={latestConversion.id}
                {...register(`charges.${i}.paymentMethod.conversion`, { valueAsNumber: true })}
              />
            </Fragment>
          ))}
          <FormErrorMessage justifyContent="center">{errors.charges?.message}</FormErrorMessage>
        </FormControl>
      </form>
    </>
  )
}
