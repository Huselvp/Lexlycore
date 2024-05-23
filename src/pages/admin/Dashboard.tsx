import styled from "styled-components"
import DashboardHeader from "../../features/Dashboard/DashboardHeader"
import FeaturesHeader from "../../ui/FeaturesHeader"
//
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
import LineChart from "../../features/Dashboard/LineChart"
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

const lineOptions = {
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
const lineLabels = [
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

const lineData = {
  labels: lineLabels,
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
const Content = styled.div`
  display: grid;
  /* grid-template-columns: repeat(2, 1fr); */
  /* grid-template-columns: 1fr 1.5fr; */
  /* grid-template-columns: 1fr max-content; */
  grid-template-columns: 1fr;
  /* grid-template-rows: 25rem auto; */
  gap: 2rem;
  & > div:nth-child(2) {
    /* height: 25rem; */
  }
  & > div:last-child {
    grid-column: 1/-1;
    min-height: 30rem;
  }
`
const Box = styled.div`
  width: 100%;
  background-color: var(--white);
  padding: 2rem 1rem;
  border-radius: var(--rounded-xl);
  & > * {
    width: 100% !important;
  }
`

const Dashboard = () => {
  return (
    <>
      <FeaturesHeader>
        <h2>Dashboard</h2>
      </FeaturesHeader>
      <Content>
        <DashboardHeader />
        {/* <Box>
          <PieChart options={pieOptions} data={pieData} />
        </Box> */}
        <Box>
          <LineChart options={lineOptions} data={lineData} />
        </Box>
      </Content>
    </>
  )
}

export default Dashboard
