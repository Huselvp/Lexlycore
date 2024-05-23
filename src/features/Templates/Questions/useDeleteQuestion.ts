import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteQuestion as deleteQuestionApi } from "../../../services/questionApi"
import { displayErrorMessage } from "../../../utils/helpers"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"

export const useDeleteQuestion = () => {
  const params = useParams()
  let templateId = Number(params.templateId) ?? -1
  const queryClient = useQueryClient()
  const { isPending: isLoading, mutate: deleteQuestion } = useMutation({
    mutationFn: deleteQuestionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template", templateId] })
      toast.success("Question deleted successfully")
    },
    onError: displayErrorMessage
  })
  return { isLoading, deleteQuestion }
}
