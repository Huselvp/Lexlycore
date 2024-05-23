import { useMutation } from "@tanstack/react-query"
import { displayErrorMessage } from "../../utils/helpers"
import { updatePassword as updatePasswordApi } from "../../services/apiAuth"
import toast from "react-hot-toast"

export const useUpdatePassword = () => {
  const { isPending: isLoading, mutate: updatePassword } = useMutation({
    mutationFn: updatePasswordApi,
    onSuccess: () => {
      toast.success("Password updated successfully")
    },
    onError: displayErrorMessage
  })
  return { isLoading, updatePassword }
}
