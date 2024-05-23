import { useState } from "react"
import Button from "../../../ui/Button"
import AddChoice from "./Choices/AddChoice"
import styled from "styled-components"
import Form from "../../../ui/AuthForm"
const ChoicesContainer = styled.div`
  border: 1px solid var(--color-grey-200);
  border-radius: var(--rounded);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  & > button {
    align-self: flex-start;
  }
`

const QuestionChoices = () => {
  const [choicesTotal, setChoicesTotal] = useState(
    Array.from({ length: 2 }, (_, i) => i)
  )
  const removeChoice = (index: number) =>
    setChoicesTotal((choices) => choices.filter((choice) => choice !== index))

  return (
    <>
      <Form.Label>Choices</Form.Label>
      <ChoicesContainer>
        {choicesTotal.map((choice) => (
          <AddChoice key={choice} removeChoice={() => removeChoice(choice)} />
        ))}
        <Button
          size="small"
          variation="priamry"
          onClick={() => setChoicesTotal((curr) => [...curr, curr.length])}
        >
          Add new choice
        </Button>
      </ChoicesContainer>
    </>
  )
}

export default QuestionChoices
