import AddEditSubQoice from "../../../features/Templates/Questions/Choices/AddEditSubQoice";
import SubQuesctionCoicesTable from "../../../features/Templates/Questions/Choices/SubQuesctionCoicesTable";
import { useSubQuestion } from "../../../features/Templates/Questions/useSubquestion";
import Button from "../../../ui/Button";
import FeaturesHeader from "../../../ui/FeaturesHeader";
import GoBackButton from "../../../ui/GoBackButton";
import Modal from "../../../ui/Modal";
import Spinner from "../../../ui/Spinner";

const SubQuestionChoice = () => {
  const { isError, isLoading, question } = useSubQuestion();
  console.log("test question :", question);
  if (isLoading) return <Spinner />;
  if (isError || !question?.valueType.startsWith("checkbox"))
    return <div>Page not Found</div>;
  return (
    <Modal>
      <GoBackButton />
      <FeaturesHeader>
        <h2>Choices</h2>
        <Modal.Open opens="add-choice">
          <Button size="medium" variation="priamry">
            Add Choice
          </Button>
        </Modal.Open>
        <Modal.Window name="add-choice">
          <AddEditSubQoice onAdd={true} />
        </Modal.Window>
      </FeaturesHeader>
      <SubQuesctionCoicesTable />
    </Modal>
  );
};

export default SubQuestionChoice;
