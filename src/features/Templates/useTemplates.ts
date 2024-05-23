import { useQuery } from "@tanstack/react-query"
import { getTemplates } from "../../services/templateApi"

export const useTemplates = () => {
  const {
    isPending: isLoading,
    isError,
    data: templates = []
  } = useQuery({
    queryKey: ["templates"],
    queryFn: getTemplates,
    retry: false
  })
  // const templates: Template[] = isError ? [] : data
  return { isLoading, isError, templates }
}
