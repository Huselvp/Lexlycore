import { useQuery } from "@tanstack/react-query"
import { getCategories } from "../../services/categoryApi"

export const useCategories = () => {
  // const [searchParams] = useSearchParams()
  // const page = Number(searchParams.get("page")) || 1
  const {
    isPending: isLoading,
    data: categories = [],
    isError
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    retry: false
  })
  console.log({ isLoading, isError, categories })
  // const categoriesArray = categories?.slice(
  //   (page - 1) * MaxItemsPerPage,
  //   page * MaxItemsPerPage
  // )
  return { isLoading, categories, isError }
}
