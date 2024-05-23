import styled from "styled-components"
import { useCategories } from "./useCategories"
import Row from "../../ui/Row"
import Button from "../../ui/Button"
import { FormEventHandler } from "react"
import { useAssignUpdateTemplateCategory } from "./useAssignUpdateTemplateCategory"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
const StyledSelect = styled.select`
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--rounded);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  text-transform: capitalize;
  option {
  }
`
const Container = styled.div`
  width: 70vw;
  h3 {
    align-self: flex-start;
  }
  /* 500px */
  @media screen and (max-width: 31.25em) {
    width: 85vw;
  }
`
const NoCotegoriesFound = styled.div`
  padding-top: 2.5rem;
  text-align: center;
  p {
    margin-bottom: 2.5rem;
  }
`
const AssignUpdateCategory = ({
  onCloseModal,
  onAssign,
  templateId
}: {
  onCloseModal?: () => void
  onAssign: boolean
  templateId: number
}) => {
  const { categories } = useCategories()
  const { isLoading, assignUpdateTemplateCategory } =
    useAssignUpdateTemplateCategory()
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const category = (Number(formData.get("category")) || 0) as number
    console.log("category = ", category, templateId)
    assignUpdateTemplateCategory(
      { onAssign, categoryId: category, templateId },
      {
        onSettled: () => {
          toast.success(
            onAssign
              ? "Subcategory assigned successfully to the template"
              : "Subcategory updated successfully"
          )
          onCloseModal?.()
        }
      }
    )
  }
  const navigate = useNavigate()
  return (
    <Container>
      {categories?.length > 0 ? (
        <Row as="form" direction="column" gap="3rem" onSubmit={onSubmit}>
          <h3>{onAssign ? "Assign Subcategory" : "Edit Subcategory"}</h3>
          <StyledSelect disabled={isLoading} name="category">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </StyledSelect>
          <Row direction="row" gap="2rem" justify="flex-end">
            <Button
              onClick={onCloseModal}
              disabled={isLoading}
              size="medium"
              variation="secondary"
              type="button"
            >
              Cancel
            </Button>
            <Button
              size="medium"
              variation="priamry"
              disabled={isLoading}
              type="submit"
            >
              {onAssign ? "Assign Subcategory" : "Edit Subcategory"}
            </Button>
          </Row>
        </Row>
      ) : (
        <NoCotegoriesFound>
          <p>
            No subcategories found. To assign a subcategory to a template, you
            need to create a subcategory first. Once created, you'll be able to
            assign it to specific templates.
          </p>
          <Button
            size="medium"
            variation="priamry"
            disabled={isLoading}
            type="submit"
            onClick={() => navigate("/a/categories")}
          >
            Create subcategory
          </Button>
        </NoCotegoriesFound>
      )}
    </Container>
  )
}

export default AssignUpdateCategory
