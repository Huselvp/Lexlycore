import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
import { displayErrorMessage, removeToken } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isPending: isLoading, mutate: logout } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      removeToken();
      navigate("/login/user");
      queryClient.removeQueries();
      toast.success("Logged out successfully");
    },
    onError: () => displayErrorMessage,
  });
  return { isLoading, logout };
};
