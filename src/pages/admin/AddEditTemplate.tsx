import styled from "styled-components"
import Row from "../../ui/Row"
import Form from "../../ui/AuthForm"
import Button from "../../ui/Button"
import Editor from "../../ui/Editor"
import { useAddTemplate } from "../../features/Templates/useAddTemplate"
import { useUpdateTemplate } from "../../features/Templates/useUpdateTemplate"
import { FormEventHandler } from "react"
import { useNavigate } from "react-router-dom"

const Container = styled.div`
  border-radius: var(--rounded-lg);
  background-color: #fff;
  padding: 2rem 2rem 5rem;
  /* 400px */
  @media screen and (max-width: 25em) {
    padding: 2rem 1rem 5rem;
  }
  overflow: hidden;
`

const AddEditTemplate = ({
  onAdd = true,
  template
}: {
  onAdd: boolean
  template?: Template
}) => {

  const navigate = useNavigate()
  const { isLoading: isLoading1, addTemplate } = useAddTemplate()
  const { isLoading: isLoading2, updateTemplate } = useUpdateTemplate()
  const isLoading = isLoading1 || isLoading2
  const templateExists = template !== undefined

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const templateName = (formData.get("templateName") || "") as string
    const templateDescription = (formData.get("templateDescription") ||
      "") as string
    const cost = (formData.get("cost") || 0) as string
   
    const content = (formData.get("texte") || "") as string
    if (onAdd)
      addTemplate(
        { templateName, templateDescription, content, cost: Number(cost) },
        {
          onSuccess: () => {
            navigate("/a/templates")
          }
        }
      )

    if (!onAdd)
      updateTemplate(
        {
          ...template!,
          content,
          templateName,
          templateDescription,
          cost: Number(cost)
        },
        {
          onSuccess: () => {
            navigate("/a/templates")
          }
        }
      )
  }

  return (
    <Container>
      <Row as="form" direction="column" gap="3rem" onSubmit={onSubmit}>
        <h2>{onAdd ? "Add Template" : "Edit Template"}</h2>
        <Form.Rows>
          <Form.Row>
            <Form.Label htmlFor="templateName">Template</Form.Label>
            <Form.Input
              defaultValue={templateExists ? template.templateName : ""}
              name="templateName"
              disabled={isLoading}
              type="text"
              id="templateName"
              required
            />
          </Form.Row>
          <Form.Row>
            <Form.Label htmlFor="templateDescription">Description</Form.Label>
            <Form.Textarea
              defaultValue={templateExists ? template.templateDescription : ""}
              name="templateDescription"
              disabled={isLoading}
              id="templateDescription"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label htmlFor="cost">Price</Form.Label>
            <Form.Input
              type="number"
              defaultValue={templateExists ? template.cost : ""}
              disabled={isLoading}
              id="cost"
              name="cost"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label>Content</Form.Label>
            <Editor
              key={template?.content || ""}
              defaultValue={template?.content || ""}
            />
          </Form.Row>
        </Form.Rows>
        <Row direction="row" gap="0" justify="flex-end">
          <Button
            disabled={isLoading}
            size="medium"
            variation="priamry"
            type="submit"
          >
            {onAdd ? "Create new template" : "Edit template"}
          </Button>
        </Row>
      </Row>
    </Container>
  )
}

export default AddEditTemplate
