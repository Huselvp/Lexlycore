import AddEditSubChoice from "./AddEditSubChoice";
//import AddEditChoice from "../../../features/Templates/Questions/Choices/AddEditChoice";
// import ChoicesTable from "../../../features/Templates/Questions/Choices/ChoicesTable";
import { useSubQuestion } from "./useSubQuestion";
import SubChoicesTable from "./SubChoicesTable";
//=====================
import Button from "../../../ui/Button";
import FeaturesHeader from "../../../ui/FeaturesHeader";
import GoBackButton from "../../../ui/GoBackButton";
import Modal from "../../../ui/Modal";
import Spinner from "../../../ui/Spinner";

const SubQuestionChoices = () => {
  const { isError, isLoading, question } = useSubQuestion();

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
          <AddEditSubChoice onAdd={true} />
        </Modal.Window>
      </FeaturesHeader>
      <SubChoicesTable />
    </Modal>
  );
};

export default SubQuestionChoices;
