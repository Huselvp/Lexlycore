import AddEditQuestion from "../../features/Templates/Questions/AddEditQuestion"
import { useTemplate } from "../../features/Templates/useTemplate"
import GoBackButton from "../../ui/GoBackButton"
import Spinner from "../../ui/Spinner"

const AddQuestion = () => {
  const { isLoading, isError, template } = useTemplate()
  if (isLoading) return <Spinner />
  if (isError || !template) return <div>No template could be found.</div>
  return (
    <>
      <GoBackButton />
      <AddEditQuestion onAdd={true} />
    </>
  )
}

export default AddQuestion
