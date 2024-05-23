import { useMutation, useQueryClient } from "@tanstack/react-query"
import { displayErrorMessage } from "../../utils/helpers"
import { updateEmail as updateEmailApi } from "../../services/apiAuth"
import toast from "react-hot-toast"

export const useUpdateEmail = () => {
  const queryClient = useQueryClient()
  const { isPending: isLoading, mutate: updateEmail } = useMutation({
    mutationFn: updateEmailApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
      toast.success("Email updated successfully")
    },
    onError: displayErrorMessage
  })
  return { isLoading, updateEmail }
}
