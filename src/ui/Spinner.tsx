import styled, { keyframes } from "styled-components"

const rotationFrame = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`
const StyledSpinner = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    width: 4.8rem;
    height: 4.8rem;
    border: 0.5rem solid var(--color-stone-500);
    /* border: 5px solid red; */
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: ${rotationFrame} 1s linear infinite;
  }
`
const Spinner = () => {
  return (
    <StyledSpinner>
      <span></span>
    </StyledSpinner>
  )
}

export default Spinner
