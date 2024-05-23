import AddEditSubQuestion from "../../features/Templates/Questions/AddEditSubQuestion"
import { useSubQuestion } from "../../features/Templates/Questions/useSubquestion"
import GoBackButton from "../../ui/GoBackButton"
import Spinner from "../../ui/Spinner"

const EditSubQuestion = () => {
  const { isLoading, isError, question } = useSubQuestion()
  if (isLoading) return <Spinner />
  if (isError) return <div>No template could be found.</div>
  return (
    <>
      <GoBackButton />
      <AddEditSubQuestion onAdd={false} question={question}/>
    </>
  )
}

export default EditSubQuestion
