import { useMutation } from "@tanstack/react-query"
import { displayErrorMessage } from "../../../utils/helpers"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export const useEditQuestion = () => {
  const navigate = useNavigate()
  const { isPending: isLoading, mutate: updateQuestion } = useMutation({
    mutationFn: async () => {},
    onSuccess: () => {
      toast.success("Question updated successfully")
      navigate(-1)
    },
    onError: displayErrorMessage
  })
  return { isLoading, updateQuestion }
}
