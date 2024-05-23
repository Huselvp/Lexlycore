import { useMutation } from "@tanstack/react-query"
// import { addQuestion as addQuestionApi } from "../../../services/questionApi"
import { displayErrorMessage } from "../../../utils/helpers"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { addSubQuestionApi } from "../../../services/subquestionapi"

export const useAddSubQuestion = () => {
  const params = useParams()
  const questionId = Number(params.questionId) ?? -1
  const navigate = useNavigate()
  const { isPending: isLoading, mutate: addSubQuestion } = useMutation({
    mutationFn: (
      subQuestion: Pick<
        SubQuestion ,
       
|"questionText" 
|"description"  
|"descriptionDetails" 
|"valueType"  
|"textArea" 
      >
    ) => addSubQuestionApi({subQuestion , questionId }),
    onSuccess: () => {
      toast.success("SubQuestion added successfully")
      navigate(-1)
    },
    onError: displayErrorMessage
  })
  return { isLoading, addSubQuestion }
}
