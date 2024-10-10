import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/categoryApi";

export const useCategories = () => {
  const {
    isPending: isLoading,
    data: categories = [],
    isError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    retry: false,
  });

  return { isLoading, categories, isError };
};
