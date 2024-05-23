import { ReactNode, useMemo, useState } from "react"
import Form from "../../../ui/AuthForm"
import { extractChoicesFromString } from "../../../utils/helpers"
import styled from "styled-components"
import { HiMiniChevronDown } from "react-icons/hi2"
import { HiMiniChevronUp } from "react-icons/hi2"

const Checkbox = styled.input`
  /* accent-color: var(--color-stone-300); */
  /* border: none; */
  position: relative;
  width: 2rem;
  height: 2rem;
  appearance: none;
  border-radius: 50%;

  &:focus {
    border-radius: 50%;
  }
  box-shadow: var(--shadow);
  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
  }
  &::before {
    background-color: var(--white);
    top: 0;
    left: 0;
    width: 2rem;
    height: 2rem;
  }
  &::after {
    opacity: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--color-stone-600);
    width: 1rem;
    height: 1rem;
  }
  &:checked::after {
    opacity: 1;
  }
  &:checked::before {
    background-color: var(--color-stone-150);
    border: 1px solid var(--color-stone-500);
  }
`
const Choices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  & > div {
    display: grid;
    grid-template-columns: repeat(2, min-content);
    grid-template-columns: min-content max-content;
    align-items: center;
    gap: 1rem;
    label {
      font-size: 1.5rem;
      color: var(--color-grey-500);
      font-weight: 500;
      cursor: pointer;
      &::first-letter {
        text-transform: uppercase;
      }
    }
  }
`
// const ChoiceLabel = styled(Form.Label)`
//   font-size: 1.4rem;
//   color: var(--color-stone-500);
//   color: var(--color-grey-500);
//   font-weight: 500;
//   &::first-letter {
//     text-transform: uppercase;
//   }
// `

const Description = styled.div`
  /* font-size: 1.6rem; */

  text-align: center;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  color: var(--color-grey-500);
  font-size: 1.3rem;
`
const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
  gap: 1rem;
  button {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--color-grey-500);
    font-weight: 500;
    background-color: var(--color-stone-150);
    border: none;
    padding: 0.6rem 1.5rem;
    font-size: 1.3rem;
    border-radius: var(--rounded-3xl);
    box-shadow: var(--shadow);
  }
`
const Details = styled(Description)`
  align-self: center;
  display: inline-block;
  background-color: var(--color-stone-150);
  padding: 2rem 3rem;
  border-radius: var(--rounded);
  box-shadow: var(--shadow-sm);
  color: var(--color-grey-500);
  font-size: 1.3rem;
  font-weight: 500;
`
const InputContainer = styled.div`
  width: 50vw;
  align-self: center;
  /* 900px */
  @media screen and (max-width: 56.25em) {
    width: 60vw;
  }
  /* 600px */
  @media screen and (max-width: 37.5em) {
    width: 75vw;
  }
  /* 500px */
  @media screen and (max-width: 25em) {
    width: 85vw;
  }
`
const Input = styled(Form.Input)`
  padding: 0.8rem 1.2rem;
`
const Textarea = styled(Form.Textarea)`
  width: 100%;
  min-height: 12rem;
`
const DocumentQuestion = ({
  question,
  children,
  value,
  setValue
}: {
  question: Question
  children: ReactNode
  setValue: (value: string) => void
  value: string | number
}) => {
  const [showDetails, setShowDetails] = useState(false)
  if (typeof question === "undefined") return null
  const choices = useMemo(
    () => extractChoicesFromString(question!.valueType),
    [question!.valueType]
  )

  return (
    <>
      <div>
        <h2>{question.questionText}</h2>
        <Description>{question.description}</Description>
      </div>
      <DetailsContainer>
        <button
          onClick={() => setShowDetails((show) => !show)}
          // disabled={disabled}
        >
          <span>{showDetails ? "Hide " : "Show"} details</span>
          {showDetails ? <HiMiniChevronUp /> : <HiMiniChevronDown />}
        </button>
        {showDetails && <Details>{question.descriptionDetails}</Details>}
      </DetailsContainer>
      <InputContainer>
        {question.valueType === "number" && (
          <Input
            // disabled={disabled}
            placeholder={question.questionText}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="number"
          />
        )}
        {question.valueType === "input" && (
          <Input
            // disabled={disabled}
            placeholder={question.questionText}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
          />
        )}
        {question.valueType === "textarea" && (
          <Textarea
            // disabled={disabled}
            placeholder={question.questionText}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}
        {question.valueType.startsWith("checkbox") && (
          <Choices>
            {choices.map((choice) => (
              <div key={choice.id}>
                <Checkbox
                  name="choice"
                  id={choice.choice}
                  value={choice.newRelatedText}
                  type="radio"
                  onChange={() => setValue(choice.newRelatedText)}
                  checked={value === choice.newRelatedText}
                />
                <label htmlFor={choice.choice}>{choice.choice}</label>
              </div>
            ))}
          </Choices>
        )}
        {children}
      </InputContainer>
    </>
  )
}

export default DocumentQuestion
