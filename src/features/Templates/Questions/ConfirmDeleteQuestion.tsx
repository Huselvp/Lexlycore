import Button from "../../../ui/Button"
import ConfirmDelete from "../../../ui/ConfirmDelete"
import { useDeleteQuestion } from "./useDeleteQuestion"

const ConfirmDeleteQuestion = ({
  questionId,
  onCloseModal
}: {
  questionId: number
  onCloseModal?: () => void
}) => {
  const { isLoading, deleteQuestion } = useDeleteQuestion()
  return (
    <ConfirmDelete>
      <h3>Delete Question</h3>
      <p>
        Are you sure you want to delete this question permanently? This action
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
          onClick={() =>
            deleteQuestion(questionId, { onSettled: onCloseModal })
          }
        >
          Delete
        </Button>
      </div>
    </ConfirmDelete>
  )
}

export default ConfirmDeleteQuestion
