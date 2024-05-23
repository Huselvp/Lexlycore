import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { getTemplate } from "../../services/templateApi"

export const useTemplate = () => {
  const params = useParams()
  let templateId = Number(params.templateId) ?? -1

  const {
    isPending: isLoading,
    isError,
    data: template,
    error
  } = useQuery({
    queryKey: ["template", templateId],
    queryFn: () => getTemplate(templateId),
    retry: false
  })
  console.log({ isLoading, isError, template })
  return { isLoading, template, isError, error }
}
