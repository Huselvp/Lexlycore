import { useMutation, useQueryClient } from "@tanstack/react-query";
import { displayErrorMessage } from "../../../utils/helpers";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { deleteSubQuestion as deleteSubQuestionApi } from "../../../services/subquestionapi";

export const useDeleteSubQuestion = () => {
  const params = useParams();
  let templateId = Number(params.templateId) ?? -1;
  const queryClient = useQueryClient();
  const { isPending: isLoading, mutate: deleteSubQuestion } = useMutation({
    mutationFn: async (variables: { idp: number; idsq: number }) => {
      const { idp, idsq } = variables;

      await deleteSubQuestionApi(idp, idsq);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template", templateId] });
      toast.success("SubQuestion deleted successfully");
    },
    onError: displayErrorMessage,
  });

  return { isLoading, deleteSubQuestion };
};
