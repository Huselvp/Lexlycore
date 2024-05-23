import styled from "styled-components"
import DocumentQuestions from "../../features/Susers/Questions/DocumentQuestions"
import { useTemplate } from "../../features/Templates/useTemplate"
import Spinner from "../../ui/Spinner"
import ErrorMessage from "../../ui/ErrorMessage"
import Header from "../../ui/Header"

const Container = styled.div`
  background-color: var(--color-grey-50);
  min-height: 100vh;
`

const CreateDocument = () => {
  const { isLoading, isError, template } = useTemplate()
  if (isLoading) return <Spinner />
  if (isError)
    return (
      <>
        <Header />
        <ErrorMessage message="Template not Found" />
      </>
    )
  const questionsLength = template?.questions.length || 0
  if (questionsLength < 1)
    return (
      <>
        <Header />
        <ErrorMessage message="Template doesn't have any questions" />
      </>
    )

  return (
    <Container>
      <DocumentQuestions />
    </Container>
  )
}
export default CreateDocument
