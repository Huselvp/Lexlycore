import { useMutation } from "@tanstack/react-query";
import { addUpdateDocumentQuestion as addUpdateDocumentQuestionApi } from "../../services/documentApi";
import {
  displayErrorMessage,
  transformParamToNumber,
} from "../../utils/helpers";
import { useParams } from "react-router-dom";

export const useAddUpdateDocumentQuestion = () => {
  const params = useParams();
  const documentId = transformParamToNumber(params.documentId);

  // const { isPending: isLoading, mutate: addUpdateDocumentQuestion } =
  //   useMutation({
  //     mutationFn: ({
  //       isDraft,
  //       values,
  //     }: {
  //       isDraft: boolean;
  //       values: { questionId: number; value: string | number }[];
  //     }) =>
  //       addUpdateDocumentQuestionApi({
  //         isDraft,
  //         values,
  //         documentId,
  //       }),

  //       console.log({
  //         isDraft,
  //         values,
  //         documentId,
  //       })

  //     onError: displayErrorMessage,
  //   });

  const { isPending: isLoading, mutate: addUpdateDocumentQuestion } =
    useMutation({
      mutationFn: ({
        isDraft,
        values,
      }: {
        isDraft: boolean;
        values: { questionId: number; value: string | number }[];
      }) => {
        console.log(
          {
            isDraft,
            values,
            documentId,
          },
          "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM"
        );

        return addUpdateDocumentQuestionApi({
          isDraft,
          values,
          documentId,
        });
      },
      onError: displayErrorMessage,
    });

  return { isLoading, addUpdateDocumentQuestion };
};
