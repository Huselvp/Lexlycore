import AddEditQuestion from "../../features/Templates/Questions/AddEditQuestion"
import { useQuestion } from "../../features/Templates/Questions/useQuestion"
import GoBackButton from "../../ui/GoBackButton"
import Spinner from "../../ui/Spinner"

const EditQuestion = () => {
  const { isLoading, isError, question } = useQuestion()
  if (isLoading) return <Spinner />
  if (isError) return <div>No template could be found.</div>
  return (
    <>
      <GoBackButton />
      <AddEditQuestion onAdd={false} question={question} />
    </>
  )
}

export default EditQuestion
