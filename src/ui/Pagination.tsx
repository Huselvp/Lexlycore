import { useSearchParams } from "react-router-dom"
import { MaxItemsPerPage } from "../utils/constants"

const Pagination = ({ totalItems }: { totalItems: number }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = +searchParams.get("page")! || 1
  const totalPages = Math.ceil(totalItems / MaxItemsPerPage)
  
  const next = () => {
    if (currentPage < totalPages) {
      searchParams.set("page", `${currentPage + 1}`)
      setSearchParams(searchParams)
    }
  }
  const prev = () => {
    if (currentPage > 1) {
      searchParams.set("page", `${currentPage - 1}`)
      setSearchParams(searchParams)
    }
  }
  return (
    <div>
      <div>Current Page = {currentPage}</div>
      <button onClick={next} disabled={currentPage >= totalPages}>
        Next
      </button>
      <button onClick={prev} disabled={currentPage <= 1}>
        Prev
      </button>
    </div>
  )
}

export default Pagination
