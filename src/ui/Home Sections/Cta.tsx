import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { HiOutlineArrowNarrowRight as ArrowRightIcon } from "react-icons/hi"
const Container = styled.div`
  padding: 6rem 2rem;
`
const Content = styled.div`
  border-radius: var(--rounded-xl);
  color: var(--white);
  padding: 12rem 2rem;
  display: grid;
  /* place-content: center; */
  grid-template-columns: 1fr 0.5fr;
  align-items: center;
  background: linear-gradient(
      to bottom,
      /* var(--color-stone-350), */ rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0.8)
    ),
    url("/cta.jpg") no-repeat center center / cover;
  gap: 5rem 2rem;

  & > div:first-child {
    & p:first-child {
      font-weight: 600;
      font-size: 2.8rem;
    }
    & p:last-child {
      font-weight: 500;
      margin-top: 2rem;
      font-size: 1.8rem;
      color: var(--color-grey-100);
    }
  }
  /* 1000px */
  @media screen and (max-width: 62.5em) {
    grid-template-columns: 1fr 0.3fr;
  }
  /* 800px */
  @media screen and (max-width: 50em) {
    justify-content: center;
    grid-template-columns: minmax(min-content, 80rem);
    text-align: center;
    padding: 8rem 1rem;
  }
`

const Btn = styled.button`
  justify-self: center;
  color: var(--white);
  background-color: var(--color-stone-500);
  border: none;
  padding: 1.25rem 3rem;
  /* font-size: 1.3rem; */
  border-radius: 30px;
  box-shadow: var(--shadow-4xl);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  &:hover {
    background-color: var(--color-stone-550);
    gap: 2rem;
  }
  svg {
    font-size: 2rem;
  }
`
const Cta = () => {
  const navigate = useNavigate()
  return (
    <Container>
      <Content>
        <div>
         
          <p>Forvandl ideer til dokumenter på få minutter!</p>
          <p>
            Lav ubesværet professionelle dokumenter på få øjeblikke. Vælg en
            skabelon, svar på et par spørgsmål, og se dine ideer komme til live.
          </p>
        
        </div>
        <Btn onClick={() => navigate("/templates")}>
          <span>Kom igang</span>
          <ArrowRightIcon />
        </Btn>
      </Content>
    </Container>
  )
}

export default Cta
