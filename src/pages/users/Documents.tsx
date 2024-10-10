import styled from "styled-components";
import { useDocuments } from "../../features/Documents/useDocuments";
import FeaturesHeader from "../../ui/FeaturesHeader";
import Spinner from "../../ui/Spinner";
import DocumentsContent from "./DocumentsContent";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  /* background-color: var(--white); */
  min-height: 100dvh;
  padding: 0 2rem 2rem;
`;

const Documents = () => {
  const navigate = useNavigate();
  const { isLoading, isError, documents } = useDocuments();

  if (isLoading) return <Spinner />;
  if (isError || !documents) return <div>Something went wrong</div>;

  return (
    <>
      <FeaturesHeader>
        <h2>Documents</h2>
        <Button
          size="medium"
          variation="priamry"
          onClick={() => navigate("/templates")}
        >
          Add Document
        </Button>
      </FeaturesHeader>
      <Container>
        <DocumentsContent />
      </Container>
    </>
  );
};

export default Documents;
