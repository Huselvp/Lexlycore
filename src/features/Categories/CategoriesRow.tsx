import Table from "../../ui/Table"
import Menus from "../../ui/Menus"
import { HiPencil, HiTrash } from "react-icons/hi2"
import Modal from "../../ui/Modal"
import AddEditCategory from "./AddEditCategory"
import ConfirmDeleteCategory from "./ConfirmDeleteCategory"

const CategoriesRow = ({ category }: { category: Category }) => {
  return (
    <Table.Row key={category.id} id={`menus-row--${String(category.id)}`}>
      <div></div>
      <div className="hideOverflow">{category.name}</div>
      <div className="hideOverflow">{category.categoryType}</div>
      <Menus.Toggle id={String(category.id)} />
      <Menus.List id={String(category.id)}>
        <Modal.Open opens={`edit-category-${category.id}`}>
          <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
        </Modal.Open>
        <Modal.Open opens={`delete-category-${category.id}`}>
          <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
        </Modal.Open>
      </Menus.List>
      <Modal.Window name={`edit-category-${category.id}`}>
        <AddEditCategory onAdd={false} category={category} />
      </Modal.Window>
      <Modal.Window name={`delete-category-${category.id}`}>
        <ConfirmDeleteCategory categoryId={category.id} />
      </Modal.Window>
    </Table.Row>
  )
}

export default CategoriesRow
