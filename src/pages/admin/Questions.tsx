import { useNavigate } from "react-router-dom";
import QuestionsTable from "../../features/Templates/Questions/QuestionsTable";
import Button from "../../ui/Button";
import FeaturesHeader from "../../ui/FeaturesHeader";
import Modal from "../../ui/Modal";
import GoBackButton from "../../ui/GoBackButton";
import { useTemplate } from "../../features/Templates/useTemplate";
import Spinner from "../../ui/Spinner";
import ErrorMessage from "../../ui/ErrorMessage";

const Questions = () => {
  // const { templateId } = useParams()
  const navigate = useNavigate();
  const { isLoading, isError, template } = useTemplate();
  if (isLoading) return <Spinner />;
  if (isError || !template)
    return <ErrorMessage message="No template could be found." />;
  return (
    <Modal>
      <GoBackButton />
      <FeaturesHeader>
        <h2>Questions</h2>
        <Button
          size="medium"
          variation="priamry"
          onClick={() => navigate("addQuestion")}
        >
          Add Question
        </Button>
      </FeaturesHeader>
      <QuestionsTable />
    </Modal>
  );
};

export default Questions;
