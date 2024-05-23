import { useQuery } from "@tanstack/react-query"
import { getUsers } from "../../services/apiAuth"

export const useUsers = () => {
  const {
    isLoading,
    data: users = [],
    isError
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers
  })
  console.log({ isLoading, users, isError })
  return { isLoading, users, isError }
}
