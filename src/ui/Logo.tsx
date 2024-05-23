import { Link } from "react-router-dom"
import styled from "styled-components"

const StyledLogo = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    object-fit: cover;
    height: 5rem;
  }
`

const Logo = ({ onShorten }: { onShorten?: boolean }) => {
  const src = onShorten ? "/docura-short.png" : "/logo.png"
  return (
    <StyledLogo to="/">
      <img src={src} />
    </StyledLogo>
  )
}

export default Logo
