import { useMutation } from "@tanstack/react-query";
import { displayErrorMessage, transformParamToNumber } from "../../utils/helpers";
import { intiatePayment as initiatePaymentApi } from "../../services/paymentApi";
import { useNavigate, useParams } from "react-router-dom";
export const useInitiatePayment = () => {
    const navigate = useNavigate();
    const params = useParams();
    const templateId = transformParamToNumber(params.templateId);
    const documentId = transformParamToNumber(params.documentId);
    const { isPending: isLoading, mutate: initiatePayment } = useMutation({
        mutationFn: (initData) => {
            if (typeof initData === "undefined")
                return initiatePaymentApi({ templateId, documentId });
            else
                return initiatePaymentApi({
                    templateId: initData.templateId,
                    documentId: initData.documentId
                });
        },
        onSuccess: (data) => navigate("/pay?p=" +
            data.paymentId +
            "&d=" +
            data.documentId +
            "&t=" +
            data.templateId),
        onError: displayErrorMessage
    });
    return { isLoading, initiatePayment };
};
