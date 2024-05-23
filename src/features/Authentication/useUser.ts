import { useQuery } from "@tanstack/react-query"
import { getMe } from "../../services/apiAuth"

export const useUser = () => {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getMe
    // enabled: false
    // retry: false
  })
  // console.log({ isLoading, user, isAuthenticated: user && !isError })
  // console.log("isinitialloading = ", isInitialLoading)
  return { isLoading, user, isAuthenticated: !!user }
  // return { isLoading, user, isAuthenticated: user ? true : false }
}
