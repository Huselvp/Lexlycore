import styled from "styled-components"
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
  PieController
} from "chart.js"
import { Line, Pie } from "react-chartjs-2"
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
)

const Container = styled.div`
  margin-top: 5rem;
  background-color: var(--white);
  padding: 2rem 1rem;
  border-radius: var(--rounded);
  height: 30rem;
`
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top" as const
    },
    title: {
      display: true,
      text: "Yearly Performance: Users and Sales"
    }
  }
}
const pieOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const
    },
    title: {
      display: true,
      text: "Sales Distribution"
    }
  }
}

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
  "Dec"
]

const data = {
  labels,
  datasets: [
    {
      label: "Users",
      data: [90, 340, 400, 450, 350, 500, 600, 650, 700, 750, 780, 888],
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)"
    },
    {
      label: "Sales",
      data: [0, 100, 40, 767, 240, 900, 1100, 400, 550, 140, 680, 1300],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)"
    }
  ]
}

const pieData = {
  labels: ["Business", "Private"],
  datasets: [
    {
      label: ["Business", "Private"],
      data: [300, 50],
      backgroundColor: ["rgb(255, 99, 132)", "rgb(255, 205, 86)"],
      hoverOffset: 4
    }
  ]
}

const DashboardCharts = () => {
  return (
    <Container>
      <Line options={options} data={data} />
      <Pie options={pieOptions} data={pieData} />
    </Container>
  )
}

export default DashboardCharts
// import {
//   BarChart,
//   Bar,
//   Rectangle,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   Label
// } from "recharts"
// import styled from "styled-components"

// const data = [
//   {
//     name: "Jan",
//     private: 4000,
//     business: 2400
//     // amt: 2400
//   },
//   {
//     name: "Feb",
//     private: 3000,
//     business: 1398
//     // amt: 2210
//   },
//   {
//     name: "Mar",
//     private: 2000,
//     business: 9800
//     // amt: 2290
//   },
//   {
//     name: "Apr",
//     private: 2780,
//     business: 3908
//     // amt: 2000
//   },
//   {
//     name: "May",
//     private: 1890,
//     business: 4800
//     // amt: 2181
//   },
//   {
//     name: "Jun",
//     private: 2390,
//     business: 3800
//     // amt: 2500
//   },
//   {
//     name: "Jul",
//     private: 3490,
//     business: 4300
//     // amt: 2100
//   },
//   {
//     name: "Aug",
//     private: 3490,
//     business: 4300
//     // amt: 2100
//   },
//   {
//     name: "Sep",
//     private: 3490,
//     business: 4300
//     // amt: 2100
//   },
//   {
//     name: "Oct",
//     private: 3490,
//     business: 4300
//     // amt: 2100
//   },
//   {
//     name: "Nov",
//     private: 3490,
//     business: 7000
//     // amt: 2100
//   },
//   {
//     name: "Dec",
//     private: 3490,
//     business: 4300
//     // amt: 2100
//   }
// ]
// const Container = styled.div`
//   margin-top: 5rem;
//   /* width: 60rem; */
//   /* width: 50rem; */
//   background-color: var(--white);
//   padding: 2rem 0;
//   border-radius: var(--rounded);
//   height: 30rem;
//   /* Hack to change grid line colors */
//   & .recharts-cartesian-grid-horizontal line,
//   & .recharts-cartesian-grid-vertical line {
//     /* stroke: var(--color-stone-900); */
//   }
// `
// const DashboardCharts = () => {
//   return (
//     <Container>
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart
//           // width={500}
//           // height={300}
//           data={data}
//           margin={{
//             top: 5,
//             right: 30,
//             left: 20,
//             bottom: 5
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           {/* <XAxis dataKey="name" /> */}
//           <XAxis dataKey="name">
//             <Label value="Months" position="insideTopRight" />
//           </XAxis>
//           {/* <YAxis /> */}
//           <YAxis>
//             <Label value="Months" position="insideTopRight" offset={-10} />
//           </YAxis>
//           <Tooltip />
//           <Legend />
//           <Bar
//             dataKey="business"
//             fill="var(--color-stone-300)"
//             activeBar={
//               <Rectangle
//                 fill="var(--color-stone-400)"
//                 stroke="var(--color-stone-500)"
//               />
//             }
//           />
//           <Bar
//             dataKey="private"
//             fill="var(--color-stone-400)"
//             activeBar={
//               <Rectangle
//                 fill="var(--color-stone-500)"
//                 stroke="var(--color-stone-600)"
//               />
//             }
//           />
//         </BarChart>
//       </ResponsiveContainer>
//     </Container>
//   )
// }

// export default DashboardCharts
