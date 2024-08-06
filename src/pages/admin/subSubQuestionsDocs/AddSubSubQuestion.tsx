import AddEditSubSubQuestion from "./AddEditSubSubQuestion";
import { useTemplate } from "../../../features/Templates/useTemplate";
import GoBackButton from "../../../ui/GoBackButton";
import Spinner from "../../../ui/Spinner";

const AddSubSubQuestion = () => {
  const { isLoading, isError, template } = useTemplate();
  if (isLoading) return <Spinner />;
  if (isError || !template) return <div>No template could be found.</div>;
  return (
    <>
      <GoBackButton />
      <AddEditSubSubQuestion onAdd={true} />
    </>
  );
};

export default AddSubSubQuestion;
