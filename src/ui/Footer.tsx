import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import Logo from "./Logo"

const StyledFooter = styled.footer`
  border-top: 1px solid var(--color-stone-300);
  background-color: var(--white);
  background-color: var(--color-stone-650);
  background-color: var(--color-grey-50);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 6rem 2rem 3rem;
  gap: 4rem 2rem;
  & nav {
    & > div {
      font-weight: 600;
      font-size: 1.7rem;
      margin-bottom: 3rem;
      /* color: var(--color-grey-600); */
    }
  }
  ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    & li {
      font-size: 1.3rem;
      font-weight: 400;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  svg {
    font-size: 2rem;
  }
  p {
    /* margin-top: 1rem; */
    font-size: 1.3rem;
    span {
      font-weight: 600;
    }
  }
  a {
    font-weight: 500;
    font-size: 1.5rem;
  }
  @media screen and (max-width: 37.5em) {
    grid-template-columns: 1fr;
    /* justify-content: center; */
    justify-items: center;
    text-align: center;
    & nav > div {
      margin-bottom: 1rem;
    }
  }
`

const LogoContainer = styled.div`
  & a {
    display: inline-block;
    /* justify-content: flex-start; */
  }
`
const Footer = () => {
  const navigate = useNavigate()
  return (
    <StyledFooter>
      <nav>
        <LogoContainer>
          <Logo />
       
        </LogoContainer>
       
      </nav>
      <nav>
        <div>Information</div>
        <ul>
          <li onClick={() => navigate("/about")}>Om os</li>
          <li onClick={() => navigate("/contact")}>Kontakt</li>
          <li onClick={() => navigate("/terms&conditions")}>
            Vilkår og betingelser
          </li>
          <li onClick={() => navigate("/privacy")}>Fortrolighedspolitik</li>
        </ul>
      </nav>
      <nav>
        <div>Populære dokumenter</div>
        <ul>
          <li>Fremtidsfuldmagt</li>
          <li>Testamente</li>
          <li>Skiftebrev</li>
          <li>Fremlejeaftale</li>
          <li>Indkøb af byggeydelser</li>
          <li>Samejekontrakt</li>
        </ul>
      </nav>
      <nav>
        <div>Genveje</div>
        <ul>
          <li>Ofte stillede spørgsmål</li>
          <li>Privat</li>
          <li>Erhverv</li>
        </ul>
      </nav>
    </StyledFooter>
  )
}

export default Footer
