import { Button, FormControl, FormLabel, Input, Select, StackProps, VStack } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { SimpleBox } from 'components/app'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FiltersForm } from './FiltersForm'
import { ReportTypeKey, reportTypes } from './reportTypes'

const formId = 'ReportFiltersForm'

const reportDelimitationSchema = z.object({
  reportType: z.string(),
  startDate: z.string(),
  endDate: z.string()
})

type ReportDelimitation = z.infer<typeof reportDelimitationSchema>

export interface ReportsSidebarProps extends Omit<StackProps, 'onSubmit'> {
  onSubmit: ({
    filters,
    reportType,
    start,
    end
  }: {
    filters: Record<string, unknown[]>
    reportType: ReportTypeKey
    start: string
    end: string
  }) => void
  isLoading: boolean
}

export const Sidebar = ({ onSubmit, isLoading, ...props }: ReportsSidebarProps) => {
  const { register, watch } = useForm<ReportDelimitation>({
    resolver: zodResolver(reportDelimitationSchema),
    defaultValues: {
      reportType: 'arqByPayMethod',
      startDate: dayjs().date(1).format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD')
    }
  })

  const { reportType, startDate, endDate } = watch()

  const currentReportType = reportTypes[reportType as ReportTypeKey]

  return (
    <VStack align="stretch" {...props}>
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

          <Button type="submit" form={formId} w="full" colorScheme="blue" isLoading={isLoading}>
            Ver informe
          </Button>
        </VStack>
      </SimpleBox>

      <FiltersForm
        key={reportType}
        schema={currentReportType.schema}
        defaultValues={currentReportType.defaultValues}
        onSubmit={(filters) =>
          onSubmit({
            filters,
            reportType: reportType as ReportTypeKey,
            start: startDate,
            end: endDate
          })
        }
        filters={currentReportType.filters}
        id={formId}
      />
    </VStack>
  )
}
