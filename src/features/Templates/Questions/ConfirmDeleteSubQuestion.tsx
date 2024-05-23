import Button from "../../../ui/Button"
import ConfirmDelete from "../../../ui/ConfirmDelete"
import { useDeleteSubQuestion } from "./useDeleteSubQuestion"

const ConfirmDeleteSubQuestion = ({
  questionId,
  questionParentId,
  onCloseModal
}: {
  questionId: number,
  questionParentId: number,
  onCloseModal?: () => void
}) => {
  const { isLoading, deleteSubQuestion } = useDeleteSubQuestion()
  console.log("subquestionId:",questionId)
  return (
    <ConfirmDelete>
      <h3>Delete SubQuestion</h3>
      <p>
        Are you sure you want to delete this SubQuestion permanently? This action
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
          onClick={() => {
            console.log("questionParentId:", questionParentId, "questionId:", questionId);
            deleteSubQuestion({ idp: questionParentId, idsq: questionId } , { onSettled: onCloseModal });
            console.log("questionParentId after :", questionParentId, "questionId after :", questionId);

          }}
        >
          Delete
        </Button>
      </div>
    </ConfirmDelete>
  )
}

export default ConfirmDeleteSubQuestion
