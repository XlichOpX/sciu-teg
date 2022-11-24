import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Colors,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js'
import { groupBy } from 'lodash'
import { Bar } from 'react-chartjs-2'
import { GroupedCategoryReport } from 'types/report'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors)

export const ArqByCategoryGraph = ({ data }: { data: GroupedCategoryReport }) => {
  const categories = Object.keys(data)
  const ungroupedData = Object.entries(data).flatMap(([, cat]) => cat)
  const groupedByCurrency = groupBy(ungroupedData, 'currency.name')

  const datasets = Object.entries(groupedByCurrency).map(([currency, data]) => ({
    label: currency,
    data: data.map((category) => category.amount)
  }))

  return (
    <Bar
      options={{
        elements: {
          bar: {
            borderWidth: 2
          }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            title: {
              display: true,
              text: 'Monto recaudado en dólares ($)'
            }
          }
        }
      }}
      data={{ labels: categories, datasets }}
    />
  )
}
