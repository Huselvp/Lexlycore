import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateCategory as updateCategoryApi } from "../../services/categoryApi"
import { displayErrorMessage } from "../../utils/helpers"
import toast from "react-hot-toast"

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  const { isPending: isLoading, mutate: updateCategory } = useMutation({
    mutationFn: updateCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Subcategory updated successfully")
    },
    onError: displayErrorMessage
  })
  return { isLoading, updateCategory }
}
