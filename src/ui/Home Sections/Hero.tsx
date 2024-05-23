import styled from "styled-components"
import { HiOutlineArrowNarrowRight as ArrowRightIcon } from "react-icons/hi"
import { useNavigate } from "react-router-dom"

const StyledHero = styled.section`
  min-height: 90dvh;
  padding: 0 2rem;
  color: var(--color-stone-50);
  background-position: center;
  background-size: cover;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("/dk.jpeg") no-repeat center center / cover;
  text-align: center;
  /* border-radius: var(--rounded-xl); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  align-items: center;
  h1 {
    color: var(--color-grey-200);
  }
  h1,
  p {
    max-width: 80rem;
    margin: 0 auto;
  }
  p {
    max-width: 60rem;
    margin-bottom: 3rem;
    font-size: 1.8rem;
    color: var(--color-grey-300);
  }
  h1 {
    font-weight: 600;
    font-size: 6rem;
  }
  button {
    background-color: var(--color-stone-500);
    border: none;
    padding: 1.5rem 3rem;
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
  }
`
const Container = styled.div`
  overflow: hidden;
`

const Hero = () => {
  const navigate = useNavigate()
  return (
    <Container>
      <StyledHero>
        <h1>Docura gør jura simpelt</h1>
        <p>
          Benyt vores smarte dokumentgenerator til at oprette juridiske
          dokumenter nemt, hurtigt og sikkert. Kontakt os for hjælp og
          vejledning
        </p>
        <button onClick={() => navigate("/templates")}>
          {/* <span>Explore templates</span> */}
          <span>Udforsk skabeloner</span>
          <ArrowRightIcon />
        </button>
      </StyledHero>
    </Container>
  )
}

export default Hero
