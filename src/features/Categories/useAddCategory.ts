import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addCategory as addCategoryApi } from "../../services/categoryApi"
import toast from "react-hot-toast"
import { displayErrorMessage } from "../../utils/helpers"

export const useAddCategory = () => {
  const queryClient = useQueryClient()
  const { isPending: isLoading, mutate: addCategory } = useMutation({
    mutationFn: addCategoryApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success("Subcategory added successfully")
    },
    onError: displayErrorMessage
  })
  return { isLoading, addCategory }
}
