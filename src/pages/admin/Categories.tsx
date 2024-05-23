import Button from "../../ui/Button"
import CategoriesTable from "../../features/Categories/CategoriesTable"
import FeaturesHeader from "../../ui/FeaturesHeader"
import Modal from "../../ui/Modal"
import AddEditCategory from "../../features/Categories/AddEditCategory"
import { useCategories } from "../../features/Categories/useCategories"
import Spinner from "../../ui/Spinner"

const Categories = () => {
  const { isLoading, isError } = useCategories()
  if (isLoading) return <Spinner />
  if (isError) return <div>Something went wrong</div>
  console.log("isLoading = ", isLoading)

  return (
    <Modal>
      <Modal.Window name="add-category">
        <AddEditCategory onAdd={true} />
      </Modal.Window>
      <FeaturesHeader>
        <h2>Subcategories</h2>
        <Modal.Open opens="add-category">
          <Button size="medium" variation="priamry">
            Add Subcategory
          </Button>
        </Modal.Open>
      </FeaturesHeader>
      <CategoriesTable />
    </Modal>
  )
}

export default Categories
