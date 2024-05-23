import styled from "styled-components"

const Container = styled.div`
  height: 100;
`

const NotFound = ({ message }: { message: string }) => {
  return <Container>{message}</Container>
}

export default NotFound
