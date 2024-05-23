import styled from "styled-components"
import { FcBriefcase as Icon } from "react-icons/fc"

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 2rem;
`

const FeaturesSection = () => {
  return (
    <Container>
      <div>
        <Icon />
        <p>Sikkert og trygt</p>
        <p>
          Vi sørger for at opbevare dine oplysninger fortroligt, ligesom dine
          data er krypteret. Docura sikrer overholdelsen af de relevante
          databeskyttelsesretlige regler.
        </p>
      </div>
      <div>
        <Icon />
        <p>Sikkert og trygt</p>
        <p>
          Vi sørger for at opbevare dine oplysninger fortroligt, ligesom dine
          data er krypteret. Docura sikrer overholdelsen af de relevante
          databeskyttelsesretlige regler.
        </p>
      </div>
      <div>
        <Icon />
        <p>Sikkert og trygt</p>
        <p>
          Vi sørger for at opbevare dine oplysninger fortroligt, ligesom dine
          data er krypteret. Docura sikrer overholdelsen af de relevante
          databeskyttelsesretlige regler.
        </p>
      </div>
    </Container>
  )
}

export default FeaturesSection
