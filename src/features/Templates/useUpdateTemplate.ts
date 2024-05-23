import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTemplate as updateTemplateApi } from "../../services/templateApi"
import { displayErrorMessage } from "../../utils/helpers"
import toast from "react-hot-toast"

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient()
  const { isPending: isLoading, mutate: updateTemplate } = useMutation({
    mutationFn: updateTemplateApi,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["templates"] })
      queryClient.invalidateQueries()
      toast.success("Template updated successfully")
    },
    onError: displayErrorMessage
  })
  return { isLoading, updateTemplate }
}
