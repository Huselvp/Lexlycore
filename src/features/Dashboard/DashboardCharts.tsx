// import styled from "styled-components";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   PieController,
// } from "chart.js";
// import { Line, Pie } from "react-chartjs-2";
// ChartJS.register(
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   PieController
// );

// const Container = styled.div`
//   margin-top: 5rem;
//   background-color: var(--white);
//   padding: 2rem 1rem;
//   border-radius: var(--rounded);
//   height: 30rem;
// `;
// const options = {
//   responsive: true,
//   maintainAspectRatio: false,
//   plugins: {
//     legend: {
//       position: "top" as const,
//     },
//     title: {
//       display: true,
//       text: "Yearly Performance: Users and Sales",
//     },
//   },
// };
// const pieOptions = {
//   maintainAspectRatio: false,
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "top" as const,
//     },
//     title: {
//       display: true,
//       text: "Sales Distribution",
//     },
//   },
// };

// const labels = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// const data = {
//   labels,
//   datasets: [
//     {
//       label: "Users",
//       data: [90, 340, 400, 450, 350, 500, 600, 650, 700, 750, 780, 888],
//       borderColor: "rgb(255, 99, 132)",
//       backgroundColor: "rgba(255, 99, 132, 0.5)",
//     },
//     {
//       label: "Sales",
//       data: [0, 100, 40, 767, 240, 900, 1100, 400, 550, 140, 680, 1300],
//       borderColor: "rgb(53, 162, 235)",
//       backgroundColor: "rgba(53, 162, 235, 0.5)",
//     },
//   ],
// };

// const pieData = {
//   labels: ["Business", "Private"],
//   datasets: [
//     {
//       label: ["Business", "Private"],
//       data: [300, 50],
//       backgroundColor: ["rgb(255, 99, 132)", "rgb(255, 205, 86)"],
//       hoverOffset: 4,
//     },
//   ],
// };

// const DashboardCharts = () => {
//   return (
//     <Container>
//       <Line options={options} data={data} />
//       <Pie options={pieOptions} data={pieData} />
//     </Container>
//   );
// };

// export default DashboardCharts;

import styled from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PieController,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PieController
);
);

const Container = styled.div`
  margin-top: 5rem;
  background-color: var(--white);
  padding: 2rem 1rem;
  border-radius: var(--rounded);
  height: 30rem;
`;

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const,
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Yearly Performance: Users and Sales",
    },
  },
};

const pieOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Sales Distribution",
    },
  },
};

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const data = {
  labels,
  datasets: [
    {
      label: "Users",
      data: [90, 340, 400, 450, 350, 500, 600, 650, 700, 750, 780, 888],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Sales",
      data: [0, 100, 40, 767, 240, 900, 1100, 400, 550, 140, 680, 1300],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const pieData = {
  labels: ["Business", "Private"],
  datasets: [
    {
      label: "Sales Distribution", // Change this to a single string
      data: [300, 50],
      backgroundColor: ["rgb(255, 99, 132)", "rgb(255, 205, 86)"],
      hoverOffset: 4,
    },
  ],
};

const DashboardCharts = () => {
  return (
    <Container>
      <Line options={options} data={data} />
      <Pie options={pieOptions} data={pieData} />
    </Container>
  );
};

export default DashboardCharts;
