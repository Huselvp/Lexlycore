import styled, { keyframes } from "styled-components"
import { BiLoaderAlt } from "react-icons/bi"

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`

const SpinnerMini = styled(BiLoaderAlt)`
  display: block;
  margin: 0 auto;
  width: 2.2rem;
  height: 2.2rem;
  animation: ${rotate} 1.5s infinite linear;
`

export default SpinnerMini
