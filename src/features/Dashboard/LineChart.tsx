import { Line } from "react-chartjs-2"

const LineChart = ({ options, data }: { options: unknown; data: unknown }) => {
  return <Line options={options} data={data} />
}

export default LineChart
