import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as adminlogin } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { displayErrorMessage } from "../../utils/helpers";

export const useAdminLogin = () => {
  const queryClient = useQueryClient();
  const { isPending: isLoading, mutate: login } = useMutation({
    mutationFn: adminlogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Successfully logged in");
    },
    onError: displayErrorMessage,
  });
  return { isLoading, login };
};
