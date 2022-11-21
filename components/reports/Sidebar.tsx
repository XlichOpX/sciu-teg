import { Button, FormControl, FormLabel, Input, Select, VStack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { SimpleBox } from 'components/app'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { getReport } from 'services/reports'
import { z } from 'zod'
import { ArqByCategoryFilters } from './ArqByCategoryFilters'
import { ArqByPayMethodFilters } from './ArqByPayMethodFilters'
import { FiltersForm } from './FiltersForm'

const formId = 'ReportFiltersForm'

const reportDelimitationSchema = z.object({
  reportType: z.string(),
  startDate: z.string(),
  endDate: z.string()
})

const reportTypes = {
  arqByCategory: {
    label: 'Arqueo por categoría',
    schema: z.object({ category: z.number().array() }),
    defaultValues: { category: [] },
    filters: ArqByCategoryFilters
  },
  arqByPayMethod: {
    label: 'Arqueo por método de pago',
    schema: z.object({ paymentMethod: z.number().array() }),
    defaultValues: { paymentMethod: [] },
    filters: ArqByPayMethodFilters
  }
}

export type ReportType = typeof reportTypes
export type ReportTypeKey = keyof typeof reportTypes
type ReportDelimitation = z.infer<typeof reportDelimitationSchema>

export const Sidebar = () => {
  const { register, watch } = useForm<ReportDelimitation>({
    resolver: zodResolver(reportDelimitationSchema),
    defaultValues: {
      reportType: 'arqByCategory',
      startDate: dayjs().date(1).format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD')
    }
  })

  const { reportType, startDate, endDate } = watch()

  const currentReportType = reportTypes[reportType as ReportTypeKey]

  return (
    <VStack align="stretch">
      <SimpleBox>
        <VStack>
          <FormControl>
            <FormLabel>Tipo de informe</FormLabel>
            <Select {...register('reportType')}>
              {Object.keys(reportTypes).map((rt) => (
                <option value={rt} key={rt}>
                  {reportTypes[rt as ReportTypeKey].label}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Fecha de inicio</FormLabel>
            <Input {...register('startDate')} type="date" max={endDate} />
          </FormControl>

          <FormControl>
            <FormLabel>Fecha de fin</FormLabel>
            <Input
              {...register('endDate')}
              type="date"
              min={startDate}
              max={dayjs().format('YYYY-MM-DD')}
            />
          </FormControl>

          <Button type="submit" form={formId} w="full" colorScheme="blue">
            Ver informe
          </Button>
        </VStack>
      </SimpleBox>

      <FiltersForm
        key={reportType}
        schema={currentReportType.schema}
        defaultValues={currentReportType.defaultValues}
        onSubmit={async (data) => {
          const report = await getReport({
            reportType: reportType as ReportTypeKey,
            start: startDate,
            end: endDate,
            filters: data
          })

          console.log({ report })
        }}
        filters={currentReportType.filters}
        id={formId}
      />
    </VStack>
  )
}
