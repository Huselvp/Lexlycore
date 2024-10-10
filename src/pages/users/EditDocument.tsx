import styled from "styled-components";
import { useDocumentQuestionsValues } from "../../features/Documents/useDocumentQuestionsValues";
import { useTemplate } from "../../features/Templates/useTemplate";
import Spinner from "../../ui/Spinner";
import DocumentQuestions from "../../features/Susers/Questions/DocumentQuestions";
import ErrorMessage from "../../ui/ErrorMessage";
import { Header } from "../../ui/FeaturesHeader";

const Container = styled.div`
  background-color: var(--color-grey-50);
  min-height: 100vh;
`;

const EditDocument = () => {
  const { isLoading: isLoading1, template, isError: isError1 } = useTemplate();
  const {
    isLoading: isLoading2,

    isError: isError2,
  } = useDocumentQuestionsValues();
  const isError = isError1 || isError2;
  const isLoading = isLoading1 || isLoading2;
  if (isError || !template)
    return (
      <>
        <Header />
        <ErrorMessage />
      </>
    );
  if (isLoading) return <Spinner />;

  return (
    <Container>
      <DocumentQuestions
        key={8685}
        documentQuestionsValues={JSON.parse(
          (localStorage.getItem("continue-later") as string | null) || "[]"
        )}
      />
    </Container>
  );
};

export default EditDocument;
