import { useMutation } from "@tanstack/react-query"
import { generateDocument as generateDocumentApi } from "../../services/documentApi"
import { displayErrorMessage } from "../../utils/helpers"

export const useGenerateDocument = () => {
  const { isPending: isLoading, mutate: generateDocument } = useMutation({
    mutationFn: generateDocumentApi,
    onSuccess: () => {
      // toast.success("Document has been successfully generated")
    },
    onError: displayErrorMessage
  })

  return { isLoading, generateDocument }
}
