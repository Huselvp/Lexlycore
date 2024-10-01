import styled from "styled-components";
import { useTemplate } from "../../features/Templates/useTemplate";
import Spinner from "../../ui/Spinner";
import ErrorMessage from "../../ui/ErrorMessage";
import Header from "../../ui/Header";

import GuestDocumentQuestions from "../../features/Susers/Questions/GuestQuestions/GuestDocumentQuestions";

const Container = styled.div`
  background-color: var(--color-grey-50);
  min-height: 100vh;
`;

function GuestDocument() {
  const { isLoading, isError, template } = useTemplate();
  if (isLoading) return <Spinner />;
  if (isError)
    return (
      <>
        <Header />
        <ErrorMessage message="Template not Found" />
      </>
    );
  const questionsLength = template?.questions.length || 0;
  if (questionsLength < 1)
    return (
      <>
        <Header />
        <ErrorMessage message="Template doesn't have any questions" />
      </>
    );

  return (
    <Container>
      <GuestDocumentQuestions />
    </Container>
  );
}

export default GuestDocument;
