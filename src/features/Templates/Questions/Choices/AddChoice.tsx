import Form from "../../../../ui/AuthForm"
import styled from "styled-components"
import { HiXMark } from "react-icons/hi2"
import Modal from "../../../../ui/Modal"
const Container = styled.div`
  position: relative;
  padding: 2rem 1rem;
  border: 1px solid var(--color-grey-200);
  border-radius: var(--rounded);
  overflow: hidden;
  & button {
    position: absolute;
    top: 0;
    right: 0.8rem;
  }
  & > div:last-child {
    margin: 0;
  }
`

const AddChoice = ({ removeChoice }: { removeChoice: () => void }) => {
  return (
    <Container>
      <Modal.Button onClick={removeChoice}>
        <HiXMark />
      </Modal.Button>
      <Form.Rows>
        <Form.Row>
          <Form.Label>Choice</Form.Label>
          <Form.Input type="text" />
        </Form.Row>
        <Form.Row>
          <Form.Label>Related Text</Form.Label>
          <Form.Input type="text" />
        </Form.Row>
      </Form.Rows>
    </Container>
  )
}

export default AddChoice

