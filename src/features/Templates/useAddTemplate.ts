import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addTemplate as addTemplateApi } from "../../services/templateApi"
import { displayErrorMessage } from "../../utils/helpers"
import toast from "react-hot-toast"

export const useAddTemplate = () => {
  const queryClient = useQueryClient()
  const { isPending: isLoading, mutate: addTemplate } = useMutation({
    mutationFn: addTemplateApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      toast.success("Template added successfully")
    },
    onError: displayErrorMessage
  })
  return { isLoading, addTemplate }
}
