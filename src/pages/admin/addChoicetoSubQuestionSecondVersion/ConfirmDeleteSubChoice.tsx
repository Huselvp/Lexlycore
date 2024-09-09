import Button from "../../../ui/Button";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import { useDeleteChoice } from "./useDeleteSubChoice";

const ConfirmDeleteSubChoice = ({
  choiceId,
  onCloseModal,
}: {
  choiceId: number;
  onCloseModal?: () => void;
}) => {
  const { isLoading, deleteChoice } = useDeleteChoice();
  return (
    <ConfirmDelete>
      <h3>Delete Choice</h3>
      <p>
        Are you sure you want to delete this choice permanently? This action
        cannot be undone.
      </p>
      <div>
        <Button
          variation="secondary"
          size="medium"
          disabled={isLoading}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button
          variation="danger"
          size="medium"
          disabled={isLoading}
          onClick={() => deleteChoice(choiceId, { onSettled: onCloseModal })}
        >
          Delete
        </Button>
      </div>
    </ConfirmDelete>
  );
};

export default ConfirmDeleteSubChoice;
