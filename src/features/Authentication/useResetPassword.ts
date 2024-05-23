import { useMutation } from "@tanstack/react-query"
import { resetPassword as resetPasswordApi } from "../../services/apiAuth"
import { displayErrorMessage } from "../../utils/helpers"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"

export const useResetPassword = () => {
  const params = useParams()
  const token: string = params.token || ""
  const navigate = useNavigate()
  const { isPending: isLoading, mutate: resetPassword } = useMutation({
    mutationFn: (newPassword: string) =>
      resetPasswordApi({ newPassword, token }),
    onSuccess: () => {
      navigate("/login")
      toast.success("Password has been successfully reset")
    },
    onError: displayErrorMessage
  })
  return { isLoading, resetPassword }
}
