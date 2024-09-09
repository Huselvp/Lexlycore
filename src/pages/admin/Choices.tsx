import AddEditChoice from "../../features/Templates/Questions/Choices/AddEditChoice";
import ChoicesTable from "../../features/Templates/Questions/Choices/ChoicesTable";
import { useQuestion } from "../../features/Templates/Questions/useQuestion";
//===============
import Button from "../../ui/Button";
import FeaturesHeader from "../../ui/FeaturesHeader";
import GoBackButton from "../../ui/GoBackButton";
import Modal from "../../ui/Modal";
import Spinner from "../../ui/Spinner";

const Choices = () => {
  const { isError, isLoading, question } = useQuestion();
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
          <AddEditChoice onAdd={true} />
        </Modal.Window>
      </FeaturesHeader>
      <ChoicesTable />
    </Modal>
  );
};

export default Choices;
