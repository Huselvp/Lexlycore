import GoBackButton from "../../ui/GoBackButton"
import AddEditTemplate from "./AddEditTemplate"

const AddTemplate = () => {
  return (
    <>
      <GoBackButton />
      <AddEditTemplate onAdd={true} />
    </>
  )
}

export default AddTemplate
