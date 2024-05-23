import { Line } from "react-chartjs-2"

const LineChart = ({ options, data }: { options: any; data: any }) => {
  return <Line options={options} data={data} />
}

export default LineChart
