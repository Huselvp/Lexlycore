import { useQuery } from "@tanstack/react-query"
import { getDocumentQuestionsValues } from "../../services/documentApi"
import { useParams } from "react-router-dom"
import { transformParamToNumber } from "../../utils/helpers"

export const useDocumentQuestionsValues = () => {
  const params = useParams()
  const documentId = transformParamToNumber(params.documentId)
  const {
    isLoading,
    data: documentQuestionsValues = [],
    isError
  } = useQuery({
    queryKey: ["document-questions-values"],
    queryFn: () => getDocumentQuestionsValues({ documentId })
  })
  console.log("test document question values in the edit :",documentQuestionsValues)
  return { isLoading, isError, documentQuestionsValues }
}
