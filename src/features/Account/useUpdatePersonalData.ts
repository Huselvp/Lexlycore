import { useMutation, useQueryClient } from "@tanstack/react-query"
import { displayErrorMessage } from "../../utils/helpers"
import { updatePersonalData as updatePersonalDataApi } from "../../services/apiAuth"
import toast from "react-hot-toast"

export const useUpdatePersonalData = () => {
  const queryClient = useQueryClient()
  const { isPending: isLoading, mutate: updatePersonalData } = useMutation({
    mutationFn: updatePersonalDataApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
      toast.success("Updated personal data successfully")
    },
    onError: displayErrorMessage
  })
  return { isLoading, updatePersonalData }
}
