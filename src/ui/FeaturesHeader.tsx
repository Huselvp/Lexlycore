import { ReactNode } from "react"
import styled from "styled-components"

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3.2rem;
  button {
    background-color: none;
    border: none;
  }
`
const FeaturesHeader = ({ children }: { children: ReactNode }) => {
  return <Header>{children}</Header>
}

export default FeaturesHeader
