import { FormEventHandler, useState } from "react"
import Form from "../../ui/AuthForm"
import InputPassword from "../../ui/InputPassword"
import Row from "../../ui/Row"
import Button from "../../ui/Button"
import { useUpdatePassword } from "./useUpdatePassword"
import toast from "react-hot-toast"
import { AContainer, ARow } from "./AccountForm"

const UpdatePasswordForm = () => {
  const { isLoading, updatePassword } = useUpdatePassword()
  // States
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  //
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (newPassword !== confirmPassword)
      return toast.error("Passwords must match")
    updatePassword(
      { newPassword, currentPassword },
      {
        onSuccess: () => {
          setCurrentPassword("")
          setNewPassword("")
          setConfirmPassword("")
        }
      }
    )
  }
  //
  return (
    <AContainer onSubmit={onSubmit}>
      <ARow>
        <Form.Label htmlFor="currentPassword">Current Password</Form.Label>
        <InputPassword
          value={currentPassword}
          setValue={setCurrentPassword}
          id="currentPassword"
          name="currentPassword"
          disabled={isLoading}
        />
      </ARow>
      <ARow>
        <Form.Label htmlFor="newPassword">New Password</Form.Label>
        <InputPassword
          value={newPassword}
          setValue={setNewPassword}
          id="newPassword"
          name="newPassword"
          disabled={isLoading}
          includeMinLength={true}
        />
      </ARow>
      <ARow>
        <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
        <InputPassword
          value={confirmPassword}
          setValue={setConfirmPassword}
          id="confirmPassword"
          name="confirmPassword"
          disabled={isLoading}
          includeMinLength={true}
        />
      </ARow>
      <Row direction="row" gap="2rem">
        <Button
          disabled={isLoading}
          size="medium"
          variation="priamry"
          type="submit"
        >
          Update Password
        </Button>
      </Row>
    </AContainer>
  )
}

export default UpdatePasswordForm
