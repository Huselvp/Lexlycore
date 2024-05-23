import styled from "styled-components"
import UpdateEmailForm from "./UpdateEmailForm"
import UpdatePasswordForm from "./UpdatePasswordForm"
const Container = styled.div`
  display: flex;
  gap: 3rem;
  flex-direction: column;
  & > form:first-child {
    border-bottom: 1px solid var(--color-grey-200);
  }
`
const LoginSecurityData = () => {
  return (
    <Container>
      <UpdateEmailForm />
      <UpdatePasswordForm />
    </Container>
  )
}

export default LoginSecurityData
