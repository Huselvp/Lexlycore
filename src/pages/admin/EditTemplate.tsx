import { useTemplate } from "../../features/Templates/useTemplate"
import GoBackButton from "../../ui/GoBackButton"
import Spinner from "../../ui/Spinner"
import AddEditTemplate from "./AddEditTemplate"

const EditTemplate = () => {
  const { isLoading, isError, template } = useTemplate()
  if (isLoading) return <Spinner />
  if (isError) return <div>No template could be found.</div>
  return (
    <>
      <GoBackButton />
      <AddEditTemplate onAdd={false} template={template} />
    </>
  )
}

export default EditTemplate
