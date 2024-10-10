import axios from "axios";
import {
  chargePaymentUrl,
  getApiConfig,
  initiatePaymentUrl,
} from "../utils/constants";

export const intiatePayment = async (
  data: Omit<chargePaymentData, "paymentId">
): Promise<chargePaymentData> => {
  const response = await axios.get(
    initiatePaymentUrl(data.templateId),
    getApiConfig()
  );

  return {
    templateId: data.templateId,
    documentId: data.documentId,
    // paymentId: response.data.data.paymentId
    paymentId: JSON.parse(response.data.data).paymentId,
  };
};

export const chargePayment = async (data: chargePaymentData) => {
  await axios.post(chargePaymentUrl, data, getApiConfig());
};
