import { useState } from "react"
import Form from "./AuthForm"
import styled from "styled-components"
import { IoEye, IoEyeOff } from "react-icons/io5"
const Container = styled.div`
  position: relative;
  span {
    font-size: 1.6rem;
    color: var(--color-grey-400);
    position: absolute;
    cursor: pointer;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    &:hover {
      color: var(--color-grey-500);
    }
  }
`
const InputPassword = ({
  value,
  setValue,
  disabled,
  name,
  id,
  includeMinLength
}: {
  id: string
  disabled: boolean
  name: string
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  includeMinLength?: boolean
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const options = {
    minLength: 0
  }
  if (includeMinLength) options.minLength = 8

  return (
    <Container>
      <Form.Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        id={id}
        name={name}
        type={showPassword ? "text" : "password"}
        disabled={disabled}
        required
        {...options}
      />
      {value.length > 0 && (
        <span
          title={showPassword ? "Hide password" : "Show password"}
          onClick={() => setShowPassword((show) => !show)}
        >
          {showPassword ? <IoEyeOff /> : <IoEye />}
        </span>
      )}
    </Container>
  )
}

export default InputPassword
