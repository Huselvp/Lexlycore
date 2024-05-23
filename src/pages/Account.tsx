import FeaturesHeader from "../ui/FeaturesHeader"
import styled from "styled-components"
import AccountBanner from "../features/Account/AccountBanner"
import { Outlet } from "react-router-dom"

const Content = styled.div`
  margin-top: 2rem;
  background-color: var(--white);
  font-size: 1.4rem;
  box-shadow: var(--shadow-sm);
  border-radius: var(--rounded);
  display: flex;
  flex-direction: column;
  gap: 2rem;
`
const Account = () => {
  return (
    <>
      <FeaturesHeader>
        <h2>Account</h2>
      </FeaturesHeader>
      <Content>
        <AccountBanner />
        <Outlet />
      </Content>
    </>
  )
}

export default Account
