import { Outlet, useNavigate } from "react-router-dom"
import Form from "./AuthForm"
import Spinner from "./Spinner"
import { useEffect } from "react"
import { useUser } from "../features/Authentication/useUser"
import styled from "styled-components"
import Logo from "./Logo"
const Container = styled(Form.Container)`
  @media screen and (max-width: 56.25em) {
    grid-template-columns: 1fr;
    & > img {
      display: none;
    }
  }
`
const AuthRoute = () => {
  const { isLoading, isAuthenticated, user } = useUser()
  const navigate = useNavigate()
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (user?.role === "ADMIN") navigate("/a")
      if (user?.role === "SUSER") navigate("/u")
    }
  }, [isLoading, isAuthenticated])
  if (isLoading) return <Spinner />
  if (!isLoading && isAuthenticated) return null

  return (
    <Container>
      <Form.Content>
        <Form.Header>
          <Logo />
          {/* <Link to="/login">
          <SuitecaseIcon />
          <span>Log in as an advisor</span>
        </Link> */}
        </Form.Header>
        <Outlet />
      </Form.Content>
      <Form.Img src="/auth.jpg" />
    </Container>
  )
}

export default AuthRoute
