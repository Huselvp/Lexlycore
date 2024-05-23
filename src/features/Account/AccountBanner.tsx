import { NavLink } from "react-router-dom"
import styled from "styled-components"

const Container = styled.div`
  padding: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid var(--color-grey-100);
  display: flex;
  gap: 2rem;
`

const Link = styled(NavLink)`
  &:focus {
    outline: none !important;
  }
  /* font-size: 1.5rem; */
  /* font-weight: 500; */
  &.active {
    color: var(--color-stone-600);
    position: relative;
    &::after {
      content: "";
      position: absolute;
      left: 0;
      /* bottom: -1.2rem; */
      bottom: calc(-1rem - 3px);
      width: 100%;
      height: 3px;
      background-color: currentColor;
    }
  }
`

const AccountBanner = () => {
  return (
    <Container>
      <Link to="personal-info">Personal info</Link>
      <Link to="login-info">Login info</Link>
    </Container>
  )
}

export default AccountBanner
