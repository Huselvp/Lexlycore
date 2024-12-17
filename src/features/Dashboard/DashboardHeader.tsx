import styled from "styled-components";
import axios from "axios";
import { useEffect, useState } from "react";
import { getApiConfig } from "../../utils/constants";
import { API } from "../../utils/constants";

const Boxes = styled.div`
  display: grid;
  /* grid-template-columns: repeat(4, 1fr); */
  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
  /* align-content: space-between; */
  gap: 1rem 2rem;
`;
const Box = styled.div`
  background-color: var(--white);
  padding: 2rem 1rem;
  padding: 2rem 1.5rem;
  border: 1px solid var(--color-grey-100);
  border-radius: var(--rounded-xl);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  & > span:first-child {
    font-weight: 500;
    color: var(--color-grey-400);
    /* color: var(--color-grey-500); */
  }
  & > span:last-child {
    font-size: 2.5rem;
    font-weight: 700;
  }
`;
const DashboardHeader = () => {
  useEffect(() => {
    const getTotalTemplates = async () => {
      try {
        const response = await axios.get(
          `${API}/public/all_templates`,
          getApiConfig()
        );

        setTotalTemplates(response.data?.length || 0);

        console.log(response.data, "templates");
      } catch (err) {
        console.error("Error fetching total templates:", err);
      }
    };

    const getTotalUsers = async () => {
      try {
        const response = await axios.get(
          `${API}/admin/all_users`,
          getApiConfig()
        );

        setTotalUsers(response.data?.length || 0);

        console.log(response.data, "@@@@@@@@@@@@@@@@@");
      } catch (err) {
        console.error("Error fetching total users:", err);
      }
    };

    getTotalTemplates();
    getTotalUsers();
  }, []);

  const getPaidTemplatesHandler = () => {};

  const coutTemplatesTotalRevenue = () => {};

  const [totalTemplates, setTotalTemplates] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSales, setTotalSales] = useState(0);

  return (
    <Boxes>
      <Box>
        <span>Total Templates</span>
        <span>{totalTemplates}</span>
      </Box>
      <Box>
        <span>Total Users</span>
        <span>{totalUsers}</span>
      </Box>
      <Box>
        <span>Total Sales</span>
        <span>{totalSales}</span>
      </Box>
      <Box>
        <span>Total Revenue</span>
        <span>$10.823,43</span>
      </Box>
    </Boxes>
  );
};

export default DashboardHeader;
