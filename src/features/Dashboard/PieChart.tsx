import { Pie } from "react-chartjs-2"

const PieChart = ({ options, data }: { options: any; data: any }) => {
  return <Pie options={options} data={data} />
}

export default PieChart
