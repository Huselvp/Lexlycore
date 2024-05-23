import Button from "../../ui/Button"
import ConfirmDelete from "../../ui/ConfirmDelete"
import { useDeleteTemplate } from "./useDeleteTemplate"

const ConfirmDeleteTemplate = ({
  templateId,
  onCloseModal
}: {
  templateId: number
  onCloseModal?: () => void
}) => {
  const { isLoading, deleteTemplate } = useDeleteTemplate()
  return (
    <ConfirmDelete>
      <h3>Delete Template</h3>
      <p>
        Are you sure you want to delete this template permanently? This action
        cannot be undone and may result in the removal of associated questions.
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
            deleteTemplate(templateId, { onSettled: onCloseModal })
          }
        >
          Delete
        </Button>
      </div>
    </ConfirmDelete>
  )
}

export default ConfirmDeleteTemplate
