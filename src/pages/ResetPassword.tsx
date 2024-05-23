import { FormEventHandler, useState } from "react"
import Form from "../ui/AuthForm"
import SpinnerMini from "../ui/SpinnerMini"
import Row from "../ui/Row"
import toast from "react-hot-toast"
import { useResetPassword } from "../features/Authentication/useResetPassword"
import InputPassword from "../ui/InputPassword"

const ResetPassword = () => {
  const { isLoading, resetPassword } = useResetPassword()
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (newPassword !== confirmPassword)
      return toast.error("Passwords must match")
    resetPassword(newPassword)
  }

  return (
    <>
      {/* <Logo /> */}
      <Form onSubmit={onFormSubmit}>
        <h3>Reset Password</h3>
        <Row direction="column" gap="2rem">
          <Form.Row>
            <Form.Label htmlFor="newPassword">New Password</Form.Label>
            <InputPassword
              value={newPassword}
              setValue={setNewPassword}
              name="newPassword"
              id="newPassword"
              disabled={isLoading}
              includeMinLength={true}
            />
          </Form.Row>
          <Form.Row>
            <Form.Label>Confirm Password</Form.Label>
            <InputPassword
              value={confirmPassword}
              setValue={setConfirmPassword}
              name="confirmPassword"
              id="confirmPassword"
              disabled={isLoading}
              includeMinLength={true}
            />
          </Form.Row>
          <Form.Button disabled={isLoading}>
            {isLoading ? <SpinnerMini /> : "Reset password"}
          </Form.Button>
        </Row>
      </Form>
    </>
  )
}

export default ResetPassword
