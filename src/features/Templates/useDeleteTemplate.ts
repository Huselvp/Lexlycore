import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteTemplate as deleteTemplateApi } from "../../services/templateApi"
import { displayErrorMessage } from "../../utils/helpers"
import toast from "react-hot-toast"

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient()
  const { isPending: isLoading, mutate: deleteTemplate } = useMutation({
    mutationFn: deleteTemplateApi,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey : ['templates']})
      toast.success("Template deleted successfully")
    },
    onError: displayErrorMessage
  })
  return { isLoading, deleteTemplate }
}
