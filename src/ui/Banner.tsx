import styled from "styled-components";
import { IoIosArrowRoundForward as Arrow } from "react-icons/io";
import { Link } from "react-router-dom";
import { useWindowListener } from "../hooks/useWindowListener";

const Container = styled.div`
  font-size: 1.4rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--color-stone-200);
  color: var(--color-stone-800);

  @media screen and (max-width: 31.25em) {
    gap: 0.8rem;
  }
  & p {
    span:first-child {
      font-weight: 600;
    }
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  a {
    display: block;
    background-color: transparent;
    display: flex;
    align-items: center;
    position: relative;
    border: 1px solid currentColor;
    border-radius: var(--rounded-3xl);
    padding: 0.5rem 1.25rem;
    box-shadow: var(--shadow-sm);
    font-weight: 500;
    &:hover {
      background-color: var(--color-stone-300);
    }
    svg {
      display: block;
    }
  }
`;

const Banner = () => {
  const { windowWidth } = useWindowListener();
  if (windowWidth <= 400) return null;
  return (
    <Container>
      <p>
        <span>Docura {new Date().getFullYear()}</span>
        <span>&#x2022;</span>

        <span>Deltag og få mange gratis funktioner</span>
      </p>
      <Link to="/register">
        <span>Registrer nu</span>
        <Arrow />
      </Link>
    </Container>
  );
};

export default Banner;
