import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  displayErrorMessage,
  transformParamToNumber
} from "../../../../utils/helpers"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"
import { deleteChoice as deleteChoiceApi } from "../../../../services/choiceApi"

export const useDeleteChoice = () => {
  const queryClient = useQueryClient()
  const params = useParams()
  const questionId = transformParamToNumber(params.questionId)
  const { isPending: isLoading, mutate: deleteChoice } = useMutation({
    mutationFn: (choiceId: number) => deleteChoiceApi({ choiceId, questionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", questionId] })
      toast.success("Choice deleted successfully")
    },
    onError: displayErrorMessage
  })
  return { isLoading, deleteChoice }
}
