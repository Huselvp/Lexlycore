import { css } from "styled-components"
import styled from "styled-components"
import { ReactNode } from "react"

const Container = styled.section`
  min-height: 100dvh;
  padding: 0;
  background-color: var(--white);
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  @media screen and (max-width: 56.25em) {
  }
  h3 {
    margin-top: 3rem;
    /* text-align: left; */
    margin-bottom: 3rem;
  }
`
const StyledForm = styled.form`
  justify-self: center;
  max-width: 55rem;
  margin: 0 auto;

  background-color: var(--color-grey-0);
  font-size: 1.4rem;
  padding: 2.4rem 4rem;
  @media screen and (max-width: 25em) {
    padding: 2.4rem 2rem;
  }
  img {
    margin: 0 auto;
    margin-bottom: 2rem;
    display: block;
  }
`
const Form = ({
  children,
  onSubmit
}: {
  children: ReactNode
  onSubmit: React.FormEventHandler<HTMLFormElement>
}) => {
  return <StyledForm onSubmit={onSubmit}>{children}</StyledForm>
}

const Row = styled.div<{ addborder?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  position: relative;
  ${(props) =>
    props.addborder === true &&
    css`
      border-top: 2px solid var(--color-grey-100);
      padding-top: 2rem;
      text-align: center;
      a {
        color: var(--color-stone-500);
        font-weight: 500;
        display: block;
        margin: 0 auto;
        &:hover {
          color: var(--color-stone-550);
        }
      }
    `}
`
const DoubleRow = styled.div`
  /* display: flex; */
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  /* flex-direction: row; */
  gap: 3rem;
`
const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  /* margin-top: 2rem; */
`
const Button = styled.button`
  /* margin-top: 2rem; */
  position: relative;
  cursor: pointer;
  border-radius: var(--rounded);
  border: none;
  color: var(--color-grey-0);
  font-weight: 500;
  /* background-color: var(--color-indigo-500); */
  background-color: var(--color-stone-550);
  padding: 1.2rem 2.4rem;
  box-shadow: var(--shadow-sm);
  &:hover {
    background-color: var(--color-stone-600);
  }
`

const Input = styled.input.attrs({ autoComplete: "off" })`
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--rounded);
  background-color: var(--color-grey-0);
  /* background-color: var(--color-grey-50); */
  box-shadow: var(--shadow-sm);
  padding-right: 30px;
  &::placeholder {
    color: var(--color-grey-300);
    font-size: 1.4rem;
  }
`
const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    background: none;
    border: none;
    color: var(--color-stone-500);
    font-weight: 500;
    &:hover {
      color: var(--color-stone-550);
    }
  }
`
const Label = styled.label`
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  span:last-child {
    color: var(--color-indigo-600);
  }
`

const Img = styled.img`
  max-width: 100%;
  height: 100vh;
  height: 100%;
  object-fit: cover;
  filter: opacity(0.8) brightness(0.5);
`

const Textarea = styled.textarea`
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--rounded);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
`
const Select = styled.select`
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: var(--rounded);
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
`
// const Select = ({
//   data,
//   onChangeHandler,
//   disabled
// }: {
//   data: { label: string; value: string }[]
//   onChangeHandler: (e: ChangeEvent<HTMLSelectElement>) => void
//   disabled: boolean
// }) => {
//   return (
//     <StyledSelect onChange={onChangeHandler}>
//       {data.map((item) => (
//         <option key={item.value} value={item.value}>
//           {item.label}
//         </option>
//       ))}
//     </StyledSelect>
//   )
// }
const Error = styled.p`
  color: var(--color-red-700);
  font-weight: 500;
  font-size: 1.2rem;
  /* position: absolute; */
  /* right: 0; */
  /* top: 0; */
`
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  a {
    display: flex;
    align-items: center;
    font-weight: 400;
    font-size: 1.2rem;
    color: var(--color-stone-550);
    gap: 0.25rem;
  }
  svg {
    color: currentColor;
    font-size: 2.5rem;
  }
`
const Content = styled.div`
  padding: 1rem 2rem;
`
const FieldValue = styled.p`
  color: #717171;
  font-size: 1.6rem;
  font-weight: 300;
`

Form.FieldValue = FieldValue
Form.DoubleRow = DoubleRow
Form.Content = Content
Form.Header = Header
Form.Error = Error
Form.Textarea = Textarea
Form.Label = Label
Form.LabelContainer = LabelContainer
Form.Input = Input
Form.Row = Row
Form.Rows = Rows
Form.Button = Button
Form.Container = Container
Form.Select = Select
Form.Img = Img
export default Form
