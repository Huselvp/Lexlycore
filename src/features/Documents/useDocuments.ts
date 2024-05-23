import { useQuery } from "@tanstack/react-query"
import { getDocments } from "../../services/documentApi"

export const useDocuments = () => {
  const {
    isLoading,
    data: documents = [],
    isError
  } = useQuery({
    queryKey: ["documents"],
    queryFn: getDocments
  })
  return { isLoading, documents, isError }
}
