import { useMutation } from "@tanstack/react-query"
import { transformParamToNumber } from "../../utils/helpers"
import { chargePayment as chargePaymentApi } from "../../services/paymentApi"
import { useNavigate, useSearchParams } from "react-router-dom"

export const useChargePayment = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const templateId = transformParamToNumber(searchParams.get("t"))
  const documentId = transformParamToNumber(searchParams.get("d"))
  const paymentId = searchParams.get("p") || ""
  const { isPending: isLoading, mutate: chargePayment } = useMutation({
    mutationFn: () => chargePaymentApi({ templateId, documentId, paymentId }),
    onSettled: () => {
      navigate("/u/documents")
    }
  })
  return { isLoading, chargePayment }
}
