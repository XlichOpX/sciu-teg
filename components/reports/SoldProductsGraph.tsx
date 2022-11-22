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
import { ProductReport } from 'types/report'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors)

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
        skipNull: true
      }}
      data={{ labels, datasets }}
    />
  )
}
