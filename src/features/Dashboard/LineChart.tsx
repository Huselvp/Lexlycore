// import { Line } from "react-chartjs-2"

// const LineChart = ({ options, data }: { options: any; data: any }) => {
//   return <Line options={options} data={data} />
// }

// export default LineChart

import { Line } from "react-chartjs-2";
import { ChartOptions, ChartData } from "chart.js"; // Import Chart.js types

interface LineChartProps {
  options: ChartOptions<"line">; // Use ChartOptions specifically for a line chart
  data: ChartData<"line", number[], string>; // Use ChartData for the line chart data
}

const LineChart = ({ options, data }: LineChartProps) => {
  return <Line options={options} data={data} />;
};

export default LineChart;
