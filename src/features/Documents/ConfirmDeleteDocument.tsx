import ConfirmDelete from "../../ui/ConfirmDelete"
import Button from "../../ui/Button"
import { useDeleteDocument } from "./useDeleteDocument"

const ConfirmDeleteDocument = ({
  documentId,
  onCloseModal
}: {
  documentId: number
  onCloseModal?: () => void
}) => {
  const { isLoading, deleteDocument } = useDeleteDocument()
  return (
    <ConfirmDelete>
      <h3>Delete Document</h3>
      <p>
        Are you sure you want to delete this document permanently? This action
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
            deleteDocument(documentId, { onSettled: onCloseModal })
          }
        >
          Delete
        </Button>
      </div>
    </ConfirmDelete>
  )
}

export default ConfirmDeleteDocument
