import {
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  VStack
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select as RSelect } from 'chakra-react-select'
import { FullyCenteredSpinner, SimpleBox } from 'components/app'
import dayjs from 'dayjs'
import { useCategories, usePaymentMethods } from 'hooks'
import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { z } from 'zod'

const reportTypes = [
  { label: 'Arqueo por categoría', value: 'arqByCategory' },
  { label: 'Arqueo por método de pago', value: 'arqByPayMethod' }
]

const validationSchema = z
  .object({
    reportType: z.string(),
    startDate: z.string(),
    endDate: z.string().refine((val) => dayjs(val) <= dayjs(), {
      message: 'La fecha de fin debe ser menor o igual al día actual'
    }),
    paymentMethods: z.number().array(),
    categories: z.number().array()
  })
  .refine((val) => dayjs(val.startDate) <= dayjs(val.endDate), {
    message: 'La fecha de inicio debe ser menor o igual a la fecha de fin',
    path: ['startDate']
  })

type ReportFormData = z.infer<typeof validationSchema>

export const Sidebar = () => {
  const { paymentMethods } = usePaymentMethods()
  const { categories } = useCategories()

  const {
    handleSubmit,
    register,
    formState: { errors },
    control
  } = useForm<ReportFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      reportType: 'arqByCategory',
      startDate: dayjs().date(1).format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
      paymentMethods: [],
      categories: []
    }
  })

  const onSubmit: SubmitHandler<ReportFormData> = async (data) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack align="stretch">
        <SimpleBox>
          <VStack>
            <FormControl>
              <FormLabel>Tipo de informe</FormLabel>
              <Select {...register('reportType')}>
                {reportTypes.map((rt) => (
                  <option value={rt.value} key={rt.value}>
                    {rt.label}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isInvalid={!!errors.startDate}>
              <FormLabel>Fecha de inicio</FormLabel>
              <Input {...register('startDate')} type="date" />
              <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.endDate}>
              <FormLabel>Fecha de fin</FormLabel>
              <Input {...register('endDate')} type="date" />
              <FormErrorMessage>{errors.endDate?.message}</FormErrorMessage>
            </FormControl>

            <Button type="submit" w="full" colorScheme="blue">
              Ver informe
            </Button>
          </VStack>
        </SimpleBox>

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
                              field.onChange(field.value.filter((v) => v !== pm.id))
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

        <SimpleBox>
          <FormControl>
            <FormLabel>Categorías</FormLabel>
            <Controller
              name="categories"
              control={control}
              render={({ field }) => (
                <RSelect
                  {...field}
                  value={categories?.filter((c) => field.value.includes(c.id))}
                  onChange={(val) => field.onChange(val.map((c) => c.id))}
                  placeholder="Seleccionar categorías"
                  isMulti
                  options={categories}
                  getOptionLabel={(o) => o.name}
                  getOptionValue={(o) => o.id.toString()}
                  closeMenuOnSelect={false}
                />
              )}
            />
          </FormControl>
        </SimpleBox>
      </VStack>
    </form>
  )
}
