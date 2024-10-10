import { Pie } from "react-chartjs-2";
// import { Pie } from "react-chartjs-2"

const PieChart = ({ options, data }: { options: any; data: any }) => {
  return <Pie options={options} data={data} />;
};

export default PieChart;
// export default PieChart

import { Pie } from "react-chartjs-2";
import { ChartOptions, ChartData } from "chart.js"; // Import the necessary types

interface PieChartProps {
  options: ChartOptions<"pie">; // Specify options for a pie chart
  data: ChartData<"pie", number[], string>; // Specify data structure for a pie chart
}

const PieChart = ({ options, data }: PieChartProps) => {
  return <Pie options={options} data={data} />;
};

export default PieChart;
