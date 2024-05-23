import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  displayErrorMessage,
  transformParamToNumber
} from "../../../utils/helpers"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { updateSubQuestion as updateSubQuestionApi } from "../../../services/subquestionapi"

export const useUpdateSubQuestion = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const params = useParams()
  const questionId = transformParamToNumber(params.questionId)
  // const subquestionId = transformParamToNumber(params.subquestionId)
  const templateId = transformParamToNumber(params.templateId)
  const { isPending: isLoading, mutate: updateSubQuestion } = useMutation({
    mutationFn: (question: SubQuestion) => updateSubQuestionApi(question, questionId),
    onSuccess: () => {
      navigate(`/a/templates/${templateId}/`)
      queryClient.invalidateQueries({ queryKey: ["template", templateId] })
      toast.success("SubQuestion updated successfully")
    },
    onError: displayErrorMessage
  })
  return { isLoading, updateSubQuestion }
}
