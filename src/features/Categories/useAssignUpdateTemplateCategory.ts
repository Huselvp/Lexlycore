import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assignUpdateCategory as assignUpdateCategoryApi } from "../../services/categoryApi";
import { displayErrorMessage } from "../../utils/helpers";

export const useAssignUpdateTemplateCategory = () => {
  const queryClient = useQueryClient();
  const { isPending: isLoading, mutate: assignUpdateTemplateCategory } =
    useMutation({
      mutationFn: assignUpdateCategoryApi,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["templates"],
        });
      },
      onError: displayErrorMessage,
    });
  return { isLoading, assignUpdateTemplateCategory };
};
