import { useMutation, useQueryClient } from "@tanstack/react-query"
import { register as registerApi } from "../../services/apiAuth"
import toast from "react-hot-toast"
import { displayErrorMessage } from "../../utils/helpers"
import { useNavigate } from "react-router-dom"

export const useRegister = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate();
  const { isPending: isLoading, mutate: register } = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["user"] })
      
      toast.success("Successfully logged in")
      navigate("/login")
    },
    onError: displayErrorMessage
  })
  return { isLoading, register }
}
