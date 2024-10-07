import Button from "../../../ui/Button";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import { useDeleteSubQuestion } from "./useDeleteSubQuestion";

const ConfirmDeleteSubQuestion = ({
  questionId,
  questionParentId,
  onCloseModal,
}: {
  questionId: number;
  questionParentId: number;
  onCloseModal?: () => void;
}) => {
  const { isLoading, deleteSubQuestion } = useDeleteSubQuestion();

  return (
    <ConfirmDelete>
      <h3>Delete SubQuestion</h3>
      <p>
        Are you sure you want to delete this SubQuestion permanently? This
        action cannot be undone.
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
          onClick={() => {
            deleteSubQuestion(
              { idp: questionParentId, idsq: questionId },
              { onSettled: onCloseModal }
            );
          }}
        >
          Delete
        </Button>
      </div>
    </ConfirmDelete>
  );
};

export default ConfirmDeleteSubQuestion;
