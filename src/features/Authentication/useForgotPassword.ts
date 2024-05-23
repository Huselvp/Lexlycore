import { useMutation } from "@tanstack/react-query"
import { forgotPassword as forgotPasswordApi } from "../../services/apiAuth"
import { displayErrorMessage } from "../../utils/helpers"

export const useForgotPassword = () => {
  const { isPending: isLoading, mutate: forgotPassword } = useMutation({
    mutationFn: forgotPasswordApi,
    onError: displayErrorMessage
  })
  return { isLoading, forgotPassword }
}
