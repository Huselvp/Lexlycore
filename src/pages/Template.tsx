import { useTemplate } from "../features/Templates/useTemplate"
import Header from "../ui/Header"
import Spinner from "../ui/Spinner"
import PageNotFound from "./PageNotFound"
import styled from "styled-components"
import Footer from "../ui/Footer"
import TemplatePriceCard from "../ui/Templates/TemplatePriceCard"
import TemplateContent from "../ui/Templates/TemplateContent"
import TemplateHero from "../ui/Templates/TemplateHero"

const Container = styled.div`
  padding: 2rem 2rem;
  /* position: relative; */
  display: grid;
  grid-template-columns: 1fr 35rem;
  gap: 3rem 2rem;
  padding-bottom: 10rem;

  @media screen and (max-width: 56.25em) {
    justify-content: center;
    grid-template-columns: minmax(min-content, 80rem);
    gap: 8rem;
  }
`

const Template = () => {
  const { isLoading, template } = useTemplate()
  if (isLoading) return <Spinner />
  if (!template) return <PageNotFound />
  return (
    <>
      <Header />
      <Container>
        <TemplateHero template={template} />
        <TemplatePriceCard template={template} />
        <TemplateContent />
      </Container>
      <Footer />
    </>
  )
}

export default Template
