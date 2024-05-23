import styled from "styled-components"
import Button from "../../ui/Button"
import { useAddCategory } from "./useAddCategory"
import { FormEventHandler } from "react"
import Form from "../../ui/AuthForm"
import Row from "../../ui/Row"
import { useUpdateCategory } from "./useUpdateCategory"
import Checkbox from "../../ui/Checkbox"

const Container = styled.div`
  /* width: 60rem; */
  width: 70vw;
  h3 {
    align-self: flex-start;
  }
  & label {
    cursor: pointer;
  }
`

const AddEditCategory = ({
  onCloseModal,
  onAdd,
  category
}: {
  onCloseModal?: () => void
  onAdd: boolean
  category?: Category
}) => {
  const { isLoading: isLoading1, addCategory } = useAddCategory()
  const { isLoading: isLoading2, updateCategory } = useUpdateCategory()

  const isLoading = isLoading1 || isLoading2

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name: string = (formData.get("subcategory") || "") as string
    const categoryType: "PRIVATE" | "BUSINESS" = formData.get("category") as
      | "PRIVATE"
      | "BUSINESS"
    // const categoryType: string = (formData.get("category") || "") as string
    console.log({ name, categoryType })
    if (onAdd) addCategory({ name, categoryType }, { onSuccess: onCloseModal })

    if (!onAdd && category)
      updateCategory(
        { ...category, name, categoryType },
        { onSuccess: onCloseModal }
      )
  }
  return (
    <Container>
      <Row as="form" direction="column" gap="3rem" onSubmit={onSubmit}>
        <h3>{onAdd ? "Add Category" : "Edit Category"}</h3>
        <Row direction="row" gap="2rem" justify="flex-start">
          <Row direction="row" gap="2rem">
            <Checkbox
              name="category"
              id={"BUSINESS"}
              value={"BUSINESS"}
              type="radio"
              checked={true}
              defaultChecked={onAdd || category?.categoryType === "BUSINESS"}
            />
            <label htmlFor={"BUSINESS"}>Erhverv</label>
          </Row>
          <Row direction="row" gap="2rem">
            {onAdd ? (
              <Checkbox
                name="category"
                id={"PRIVATE"}
                value={"PRIVATE"}
                type="radio"
              />
            ) : (
              <Checkbox
                name="category"
                id={"PRIVATE"}
                value={"PRIVATE"}
                type="radio"
                defaultChecked={!onAdd && category?.categoryType === "PRIVATE"}
              />
            )}
            <label htmlFor={"PRIVATE"}>Privat</label>
          </Row>
        </Row>
        <Form.Input
          autoFocus
          placeholder="Divorce..."
          type="text"
          defaultValue={`${
            typeof category === "undefined" ? "" : category?.name
          }`}
          disabled={isLoading}
          name="subcategory"
          required
        />
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
          <Button size="medium" variation="priamry" disabled={isLoading}>
            {onAdd ? "Create New Subcategory" : "Edit Subcategory"}
          </Button>
        </Row>
      </Row>
    </Container>
  )
}

export default AddEditCategory
