import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateQuestion as updateQuestionApi } from "../../../services/questionApi"
import {
  displayErrorMessage,
  transformParamToNumber
} from "../../../utils/helpers"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"

export const useUpdateQuestion = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const params = useParams()
  const questionId = transformParamToNumber(params.questionId)
  const templateId = transformParamToNumber(params.templateId)
  const { isPending: isLoading, mutate: updateQuestion } = useMutation({
    mutationFn: updateQuestionApi,
    onSuccess: () => {
      navigate(`/a/templates/${templateId}/`)
      queryClient.invalidateQueries({ queryKey: ["question", questionId] })
      toast.success("Question updated successfully")
    },
    onError: displayErrorMessage
  })
  return { isLoading, updateQuestion }
}
