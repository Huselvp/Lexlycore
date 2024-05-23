import styled from "styled-components"
import { useWindowListener } from "../../hooks/useWindowListener"
import Form from "../../ui/AuthForm"
import Menus from "../../ui/Menus"
import Table from "../../ui/Table"
import TemplatesRow from "./TemplatesRow"
import { useTemplates } from "./useTemplates"
import { useState } from "react"

const Select = styled(Form.Select)`
  padding: 0.5rem 1.2rem;
`

const TemplatesTable = () => {
  const { templates } = useTemplates()
  const { windowWidth } = useWindowListener()
  const [filteredBy, setFilteredBy] = useState<"all" | "private" | "business">(
    "all"
  )
  const data: Template[] =
    filteredBy === "private"
      ? templates.filter(
          (temp) => temp?.subcategory?.categoryType === "PRIVATE"
        )
      : filteredBy === "business"
      ? templates.filter(
          (temp) => temp?.subcategory?.categoryType === "BUSINESS"
        )
      : templates
  const columns =
    windowWidth >= 600
      ? "1.5rem 1fr .7fr .7fr .5fr 3rem"
      : "1.5rem 1fr .25fr 3rem"
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
        {/* <Table columns="1.5rem 1fr .7fr .7fr .5fr 3rem"> */}
        <Table columns={columns}>
          <Table.Header>
            <div>#</div>
            <div>Template</div>
            {windowWidth >= 600 && (
              <>
                <div>Category</div>
                <div>Subcategory</div>
              </>
            )}
            <div>Price</div>
          </Table.Header>
          <Table.Body
            data={data}
            render={(template) => (
              <TemplatesRow
                onMobile={windowWidth < 600}
                key={template.id}
                template={template}
              />
            )}
          />
        </Table>
      </Menus>
    </>
  )
}

export default TemplatesTable
