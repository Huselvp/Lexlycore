import styled from "styled-components";
import Form from "../../../ui/AuthForm";
import Button from "../../../ui/Button";
import { useAddEditSubChoice } from "./useAddEditSubChoice";
import Row from "../../../ui/Row";
import { FormEventHandler } from "react";
import toast from "react-hot-toast";

const Container = styled.div`
  width: 70vw;
  h3 {
    align-self: flex-start;
  }
  /* 500px */
  @media screen and (max-width: 31.25em) {
    width: 85vw;
  }
`;
const AddEditSubChoice = ({
  onAdd,
  onCloseModal,
  choice,
}: {
  onAdd: boolean;
  onCloseModal?: () => void;
  choice?: Choice;
}) => {
  const { isLoading, addEditChoice } = useAddEditSubChoice();

  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const choiceText = (formData.get("choice") || "") as string;
    const newRelatedText = (formData.get("newRelatedText") || "") as string;

    if (onAdd)
      addEditChoice(
        {
          onAdd,
          choice: { choice: choiceText, newRelatedText, id: 0 },
        },
        {
          onSuccess: () => {
            toast.success("Choice added successfully");
            onCloseModal?.();
          },
        }
      );
    if (!onAdd && choice)
      addEditChoice(
        {
          onAdd,
          choice: { ...choice, choice: choiceText, newRelatedText },
        },
        {
          onSuccess: () => {
            toast.success("Choice updated successfully");
            onCloseModal?.();
          },
        }
      );
  };

  return (
    <Container>
      <Row as="form" direction="column" gap="3rem" onSubmit={onSubmit}>
        <h3>{onAdd ? "Add Choice" : "Edit Choice"}</h3>
        <Form.Rows>
          <Form.Row>
            <Form.Label>Choice</Form.Label>
            <Form.Input
              defaultValue={choice?.choice || ""}
              name="choice"
              type="text"
              disabled={isLoading}
              required
            />
          </Form.Row>
          <Form.Row>
            <Form.Label>Related Text</Form.Label>
            <Form.Input
              defaultValue={choice?.newRelatedText || ""}
              name="newRelatedText"
              type="text"
              disabled={isLoading}
              required
            />
          </Form.Row>
        </Form.Rows>
        <Row gap="2rem" direction="row" justify="flex-end">
          <Button
            size="medium"
            variation="secondary"
            onClick={onCloseModal}
            disabled={isLoading}
            type="button"
          >
            Cancel
          </Button>
          <Button
            size="medium"
            variation="priamry"
            type="submit"
            disabled={isLoading}
          >
            {onAdd ? "Create new choice" : "Edit choice"}
          </Button>
        </Row>
      </Row>
    </Container>
  );
};

export default AddEditSubChoice;
