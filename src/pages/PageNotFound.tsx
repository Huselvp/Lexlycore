import styled from "styled-components"
import Button from "../ui/Button"
import { useNavigate } from "react-router-dom"

const Container = styled.div`
  height: 100vh;
  text-align: center;
  width: 100%;
  display: grid;
  place-content: center;
  /* background-color: var(--color-stone-150); */
  color: var(--color-grey-600);
  & div {
    font-weight: 700;
  }
  & div:first-child {
    font-size: 10rem;
  }
  & div:nth-child(2) {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  & button {
    margin-top: 3rem;
  }
`
const PageNotFound = () => {
  const navigate = useNavigate()
  return (
    <Container>
      <div>404</div>
      <div>Page Not Found</div>
      <p>The page requested couldn't be found.</p>
      <p>This could be a spelling in the URL or a removal page.</p>
      <Button onClick={() => navigate("/")} variation="priamry" size="large">
        HOMEPAGE
      </Button>
    </Container>
  )
}

export default PageNotFound
