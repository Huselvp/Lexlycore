import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  displayErrorMessage,
  transformParamToNumber,
} from "../../../../utils/helpers";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { deleteChoice as deleteChoiceApi } from "../../../../services/subChoiceapi";

export const useDeleteSubCoice = () => {
  const queryClient = useQueryClient();
  const params = useParams();

  const subquestionId = transformParamToNumber(params.subquestionId);

  const { isPending: isLoading, mutate: deleteChoice } = useMutation({
    mutationFn: (choiceId: number) =>
      deleteChoiceApi({ subquestionId, choiceId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", subquestionId] });
      toast.success("Choice deleted successfully");
    },
    onError: displayErrorMessage,
  });

  return { isLoading, deleteChoice };
};
