import styled from "styled-components"
import Menus from "../../ui/Menus"
import Table from "../../ui/Table"
import CategoriesRow from "./CategoriesRow"
import { useCategories } from "./useCategories"
import Form from "../../ui/AuthForm"
import { useState } from "react"

const Select = styled(Form.Select)`
  padding: 0.5rem 1.2rem;
`

const CategoriesTable = () => {
  const { categories } = useCategories()
  const [filteredBy, setFilteredBy] = useState<"all" | "private" | "business">(
    "all"
  )
  const data: Category[] =
    filteredBy === "private"
      ? categories.filter((cat) => cat.categoryType === "PRIVATE")
      : filteredBy === "business"
      ? categories.filter((cat) => cat.categoryType === "BUSINESS")
      : categories
  return (
    <>
      <div style={{ marginBottom: "2rem" }}>
        <Select
          defaultValue={"all"}
          onChange={(e) =>
            setFilteredBy(e.target.value as "all" | "private" | "business")
          }
        >
          <option value="all">All</option>
          <option value="private">Private</option>
          <option value="business">Business</option>
        </Select>
      </div>
      <Menus>
        <Table columns="1.5rem 1fr .3fr 3rem">
          <Table.Header>
            <div>#</div>
            <div>Subcategory</div>
            <div>Category</div>
            <div></div>
          </Table.Header>
          <Table.Body
            data={data}
            render={(category) => (
              <CategoriesRow key={category.id} category={category} />
            )}
          ></Table.Body>
          {/* <Table.Footer> */}
          {/* <Pagination totalItems={categories.length} /> */}
          {/* </Table.Footer> */}
        </Table>
      </Menus>
    </>
  )
}

export default CategoriesTable
