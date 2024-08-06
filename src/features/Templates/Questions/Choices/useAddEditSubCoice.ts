import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  displayErrorMessage,
  transformParamToNumber,
} from "../../../../utils/helpers";
import { addEditSubChoice as addEditChoiceApi } from "../../../../services/subChoiceapi";
import { useParams } from "react-router-dom";

export const useAddEditSubCoice = () => {
  const params = useParams();
  const questionId = transformParamToNumber(params.questionId);
  const subquestionId = transformParamToNumber(params.subquestionId);
  const queryClient = useQueryClient();
  const { isPending: isLoading, mutate: addEditChoice } = useMutation({
    mutationFn: ({ onAdd, choice }: { onAdd: boolean; choice: Choice }) =>
      addEditChoiceApi({ questionId, subquestionId, choice, onAdd }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
    },
    onError: displayErrorMessage,
  });
  return { isLoading, addEditChoice };
};
