import { Pie } from "react-chartjs-2";

const PieChart = ({ options, data }: { options: unknown; data: unknown }) => {
  return <Pie options={options} data={data} />;
};

export default PieChart;
