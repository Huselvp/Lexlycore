import styled from "styled-components";
import Form from "../../../ui/AuthForm";
import Button from "../../../ui/Button";
import Editor from "../../../ui/Editor";
import { FormEventHandler } from "react";
import Row from "../../../ui/Row";
import { questionsAnsewersTypes } from "../../../utils/constants";
import { useAddSubSubQuestion } from "./useAddSubSubQuestion";
import { useUpdateSubSubQuestion } from "./useUpdateSubSubQuestion";

const Container = styled.div`
  border-radius: var(--rounded-lg);
  background-color: #fff;
  padding: 2rem;
  padding-bottom: 5rem;
  /* 400px */
  @media screen and (max-width: 25em) {
    padding: 2rem 1rem 5rem;
  }
`;

const AddEditSubSubQuestion = ({
  onAdd,
  question,
}: {
  onAdd: boolean;
  question?: SubQuestion;
}) => {
  const { isLoading: isLoading1, addSubQuestion } = useAddSubSubQuestion();
  const { isLoading: isLoading2, updateSubQuestion } =
    useUpdateSubSubQuestion();
  const isLoading = isLoading1 || isLoading2;
  const isQuestionProvided = typeof question !== "undefined";
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const questionText = (formData.get("questionText") || "") as string;
    const description = (formData.get("description") || "") as string;
    const descriptionDetails = (formData.get("descriptionDetails") ||
      "") as string;
    const textArea = (formData.get("textArea") || "") as string;
    const valueType = (formData.get("valueType") || "") as string;
   
    if (onAdd) {
      addSubQuestion({
        questionText,
        description,
        descriptionDetails,
        valueType,
        textArea,
      });
    }
    if (!onAdd && question)
      updateSubQuestion({
        ...question,
        questionText,
        description,
        descriptionDetails,
        valueType,
        textArea,
      });
  };

  return (
    <Container>
      <Row as="form" direction="column" gap="3rem" onSubmit={onSubmit}>
        <h2>{onAdd ? "Add SubQuestion" : "Edit SubQuestion"}</h2>
        <Form.Rows>
          <Form.Row>
            <Form.Label htmlFor="question">SubQuestion</Form.Label>
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
              defaultValue={isQuestionProvided ? question.Description : ""}
              name="description"
              disabled={isLoading}
              id="description"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label htmlFor="details">Details</Form.Label>
            <Form.Textarea
              defaultValue={
                isQuestionProvided ? question.description_details : ""
              }
              name="descriptionDetails"
              disabled={isLoading}
              id="details"
            />
          </Form.Row>
          <Form.Row>
            <Form.Label>Content</Form.Label>
            <Editor
              defaultValue={isQuestionProvided ? question.text_area : ""}
              name="textArea"
            />
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
            {onAdd ? "Create new Subquestion" : "Edit Subquestion"}
          </Button>
        </Row>
      </Row>
    </Container>
  );
};

export default AddEditSubSubQuestion;
