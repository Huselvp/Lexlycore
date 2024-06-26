import styled from "styled-components"
import Form from "../../../ui/AuthForm"
import Button from "../../../ui/Button"
import Editor from "../../../ui/Editor"
import { FormEventHandler } from "react"
import { useAddQuestion } from "./useAddQuestion"
import { useUpdateQuestion } from "./useUpdateQuestion"
import Row from "../../../ui/Row"
import { questionsAnsewersTypes } from "../../../utils/constants"
import React, { useState } from "react";

const Container = styled.div`
  border-radius: var(--rounded-lg);
  background-color: #fff;
  padding: 2rem;
  padding-bottom: 5rem;
  /* 400px */
  @media screen and (max-width: 25em) {
    padding: 2rem 1rem 5rem;
  }
`

const AddEditQuestion = ({
  onAdd,
  question
}: {
  onAdd: boolean
  question?: Question
}) => {
  const { isLoading: isLoading1, addQuestion } = useAddQuestion()
  const { isLoading: isLoading2, updateQuestion } = useUpdateQuestion()
  const isLoading = isLoading1 || isLoading2
  const isQuestionProvided = typeof question !== "undefined"
  const [editorContent, setEditorContent] = useState(isQuestionProvided ? question.texte : "");
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const questionText = (formData.get("questionText") || "") as string
    const description = (formData.get("description") || "") as string
    const descriptionDetails = (formData.get("descriptionDetails") ||
      "") as string
    const texte = (formData.get("texte") || "") as string
    const valueType = (formData.get("valueType") || "") as string
    // check if texte is a valid html
    console.log("texte = ", texte)
    if (onAdd) {
      addQuestion({
        questionText,
        description,
        descriptionDetails,
        texte,
        valueType
      })
    }
    if (!onAdd && question)
      updateQuestion({
        ...question,
        questionText,
        description,
        descriptionDetails,
        texte,
        valueType
      })
  }
  return (
    <Container>
      <Row as="form" direction="column" gap="3rem" onSubmit={onSubmit}>
        <h2>{onAdd ? "Add Question" : "Edit Question"}</h2>
        <Form.Rows>
          <Form.Row>
            <Form.Label htmlFor="question">Question</Form.Label>
            <Form.Input
              defaultValue={isQuestionProvided ? question.questionText : ""}
              name="questionText"
              disabled={isLoading}
              type="text"
              id="question"
              required
            />
          </Form.Row>
          <Form.Row>
            <Form.Label htmlFor="description">Description</Form.Label>
            <Form.Textarea
              defaultValue={isQuestionProvided ? question.description : ""}
              name="description"
              disabled={isLoading}
              id="description"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label htmlFor="details">Details</Form.Label>
            <Form.Textarea
              defaultValue={
                isQuestionProvided ? question.descriptionDetails : ""
              }
              name="descriptionDetails"
              disabled={isLoading}
              id="details"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label>Content</Form.Label>
            <Editor defaultValue={isQuestionProvided ? question.texte : ""} name="texte" onChange={
              setEditorContent
            }/>
          </Form.Row>
          <Form.Row>
            <Form.Label>Type</Form.Label>
            <Form.Select
              name="valueType"
              defaultValue={
                isQuestionProvided
                  ? questionsAnsewersTypes.find(
                      (q) => q.value === question.valueType
                    )?.value
                  : ""
              }
              disabled={isLoading}
            >
              {questionsAnsewersTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Form.Select>
          </Form.Row>
        </Form.Rows>
        <Row direction="row" gap="0" justify="flex-end">
          <Button
            disabled={isLoading}
            size="medium"
            variation="priamry"
            type="submit"
          >
            {onAdd ? "Create new question" : "Edit question"}
          </Button>
        </Row>
      </Row>
    </Container>
  )
}

export default AddEditQuestion
