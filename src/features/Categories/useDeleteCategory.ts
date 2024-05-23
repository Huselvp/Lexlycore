import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteCategory as deleteCategoryApi } from "../../services/categoryApi"
import { displayErrorMessage } from "../../utils/helpers"
import toast from "react-hot-toast"

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  const { isPending: isLoading, mutate: deleteCategory } = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Subcategory deleted successfully")
    },
    onError: displayErrorMessage
  })
  return { isLoading, deleteCategory }
}
