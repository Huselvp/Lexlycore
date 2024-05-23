import Button from "../../ui/Button"
import ConfirmDelete from "../../ui/ConfirmDelete"
import { useDeleteCategory } from "./useDeleteCategory"

const ConfirmDeleteCategory = ({
  categoryId,
  onCloseModal
}: {
  categoryId: number
  onCloseModal?: () => void
}) => {
  const { isLoading, deleteCategory } = useDeleteCategory()
  return (
    <ConfirmDelete>
      <h3>Delete Subcategory</h3>
      <p>
        Are you sure you want to delete this subcategory permanently? This
        action cannot be undone and may result in the removal of associated
        templates.
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
            deleteCategory(categoryId, { onSettled: onCloseModal })
          }
        >
          Delete
        </Button>
      </div>
    </ConfirmDelete>
  )
}

export default ConfirmDeleteCategory
