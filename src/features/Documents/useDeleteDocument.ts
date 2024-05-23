import { useMutation, useQueryClient } from "@tanstack/react-query"
import { displayErrorMessage } from "../../utils/helpers"
import toast from "react-hot-toast"
import { deleteDocument as deleteDocumentApi } from "../../services/documentApi"

export const useDeleteDocument = () => {
  const queryClient = useQueryClient()
  const { isPending: isLoading, mutate: deleteDocument } = useMutation({
    mutationFn: deleteDocumentApi,
    onSuccess: () => {
      toast.success("Document deleted successfully")
      queryClient.invalidateQueries({ queryKey: ["documents"] })
    },
    onError: displayErrorMessage
  })
  return { isLoading, deleteDocument }
}
