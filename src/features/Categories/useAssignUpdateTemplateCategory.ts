import { useMutation, useQueryClient } from "@tanstack/react-query"
import { assignUpdateCategory as assignUpdateCategoryApi } from "../../services/categoryApi"
import { displayErrorMessage } from "../../utils/helpers"
// import toast from "react-hot-toast"

export const useAssignUpdateTemplateCategory = () => {
  const queryClient = useQueryClient()
  const { isPending: isLoading, mutate: assignUpdateTemplateCategory } =
    useMutation({
      mutationFn: assignUpdateCategoryApi,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["templates"]
        })
        // toast.success("Category assigned successfully to the template")
      },
      onError: displayErrorMessage
    })
  return { isLoading, assignUpdateTemplateCategory }
}
