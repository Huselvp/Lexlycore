import axios from "axios"
import {
  chargePaymentUrl,
  getApiConfig,
  initiatePaymentUrl
} from "../utils/constants"

export const intiatePayment = async (
  data: Omit<chargePaymentData, "paymentId">
): Promise<chargePaymentData> => {
  const response = await axios.get(
    initiatePaymentUrl(data.templateId),
    getApiConfig()
  )
  console.log("Response: " + response)
  console.log("paymentId = ", JSON.parse(response.data.data).paymentId)
  // const response = await axios.get(
  //   initiatePaymentUrl(data.templateId)
  //   // getApiConfig()
  // )
  // console.log("Response: " + response.data.data.paymentId)
  return {
    templateId: data.templateId,
    documentId: data.documentId,
    // paymentId: response.data.data.paymentId
    paymentId: JSON.parse(response.data.data).paymentId
  }
}

export const chargePayment = async (data: chargePaymentData) => {
  const response = await axios.post(chargePaymentUrl, data, getApiConfig())
  // const response = await axios.post(chargePaymentUrl, data, getApiConfig())
  console.log("Response = ", response)
}
// export const chargePayment = async (data: chargePaymentData) => {
//   const response = await axios.post(chargePaymentUrl, data)
//   // const response = await axios.post(chargePaymentUrl, data, getApiConfig())
//   console.log("Response = ", response)
// }
