import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  displayErrorMessage,
  transformParamToNumber,
} from "../../../utils/helpers";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { deleteChoice as deleteChoiceApi } from "./subChoiceApi";

export const useDeleteChoice = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const subquestionId = transformParamToNumber(params.subquestionId);
  const questionId = transformParamToNumber(params.questionId);
  const { isPending: isLoading, mutate: deleteChoice } = useMutation({
    mutationFn: (choiceId: number) =>
      deleteChoiceApi({ choiceId, subquestionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
      toast.success("Choice deleted successfully");
    },
    onError: displayErrorMessage,
  });
  return { isLoading, deleteChoice };
};
