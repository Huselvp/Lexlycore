import styled from "styled-components"

const Boxes = styled.div`
  display: grid;
  /* grid-template-columns: repeat(4, 1fr); */
  grid-template-columns: repeat(auto-fit, minmax(25rem, 1fr));
  /* align-content: space-between; */
  gap: 1rem 2rem;
`
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
`
const DashboardHeader = () => {
  return (
    <Boxes>
      <Box>
        <span>Total Templates</span>
        <span>1435</span>
      </Box>
      <Box>
        <span>Total Users</span>
        <span>67,322</span>
      </Box>
      <Box>
        <span>Total Sales</span>
        <span>32,444</span>
      </Box>
      <Box>
        <span>Total Revenue</span>
        <span>$10.823,43</span>
      </Box>
    </Boxes>
  )
}

export default DashboardHeader
