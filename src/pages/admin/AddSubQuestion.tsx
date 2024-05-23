import AddEditSubQuestion from "../../features/Templates/Questions/AddEditSubQuestion"
import { useTemplate } from "../../features/Templates/useTemplate"
import GoBackButton from "../../ui/GoBackButton"
import Spinner from "../../ui/Spinner"


const AddSubQuestion = () => {
  const { isLoading, isError, template } = useTemplate()
  if (isLoading) return <Spinner />
  if (isError || !template) return <div>No template could be found.</div>
  return (
    <>
      <GoBackButton />
      <AddEditSubQuestion onAdd={true}/>
    </>
  )
}

export default AddSubQuestion
