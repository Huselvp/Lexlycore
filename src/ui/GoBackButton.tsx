import styled from "styled-components"
import { MdKeyboardBackspace } from "react-icons/md"
import { useNavigate } from "react-router-dom"

const Button = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.9rem 1.5rem;
  border-radius: var(--rounded-3xl);
  text-align: center;
  cursor: pointer;
  /* margin-top: -2rem; */
  margin-bottom: 2rem;
  font-size: 1.2rem;
  font-weight: 500;
  background-color: var(--white);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
  /* // 700 px */
  /* @media screen and (max-width: 43.75em) {
      margin-left: 1.5rem;
      margin-top: -1rem;
    } */
  &:hover {
    /* color: var(--white); */
    /* background-color: var(-/-color-stone-100); */
  }
  svg {
    display: block;
    fill: currentColor;
    font-size: 1.4rem;
  }
`

const GoBackButton = () => {
  const navigate = useNavigate()
  return (
    <Button onClick={() => navigate(-1)}>
      <MdKeyboardBackspace />
      <span>Back</span>
    </Button>
  )
}

export default GoBackButton
