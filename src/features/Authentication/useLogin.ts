import { useMutation, useQueryClient } from "@tanstack/react-query"
import { login as loginApi } from "../../services/apiAuth"
import toast from "react-hot-toast"
import { displayErrorMessage } from "../../utils/helpers"

export const useLogin = () => {
  const queryClient = useQueryClient()
  const { isPending: isLoading, mutate: login } = useMutation({
    mutationFn: loginApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
      toast.success("Successfully logged in")
    },
    onError: displayErrorMessage
  })
  return { isLoading, login }
}
