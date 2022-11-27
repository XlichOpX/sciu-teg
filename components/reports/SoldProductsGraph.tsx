import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from 'chart.js'
import { groupBy } from 'lodash'
import { Bar } from 'react-chartjs-2'
import { ProductReport } from 'types/report'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const SoldProductsGraph = ({ data }: { data: ProductReport[] }) => {
  const groupedData = groupBy(data, 'category.name')

  const labels = Object.keys(groupedData)
  const datasets = data.map((product) => {
    const labelIndex = labels.findIndex((val) => val === product.category.name)
    const data = Array.from({ length: labels.length }).fill(null)
    data[labelIndex] = product.quantity

    return {
      label: product.name,
      data
    }
  })

  return (
    <Bar
      options={{
        indexAxis: 'y',
        elements: {
          bar: {
            borderWidth: 2
          }
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'right'
          }
        },
        skipNull: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Unidades vendidas'
            }
          }
        }
      }}
      data={{ labels, datasets }}
    />
  )
}
