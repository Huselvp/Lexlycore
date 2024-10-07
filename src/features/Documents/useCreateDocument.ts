import { useMutation } from "@tanstack/react-query";
import { createDocument as createDocumentApi } from "../../services/documentApi";
import { displayErrorMessage } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

export const useCreateDocument = () => {
  const navigate = useNavigate();
  const {
    isError,
    isPending: isLoading,
    mutate: createDocument,
  } = useMutation({
    mutationFn: createDocumentApi,
    onSuccess: ({
      documentId,
      templateId,
    }: {
      documentId: number;
      templateId: number;
    }) => {
      navigate(`/createDocument/${templateId}/${documentId}`);
    },
    onError: displayErrorMessage,
  });
  return { isLoading, createDocument, isError };
};
