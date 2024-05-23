import { FormEventHandler, useEffect, useState } from "react"
import { useUser } from "../Authentication/useUser"
import Form from "../../ui/AuthForm"
import { useUpdateEmail } from "./useUpdateEmail"
import InputPassword from "../../ui/InputPassword"
import Row from "../../ui/Row"
import Button from "../../ui/Button"
import toast from "react-hot-toast"
import isEmail from "validator/lib/isEmail"
import { AContainer, ARow } from "./AccountForm"

const UpdateEmailForm = () => {
  const { user } = useUser()
  const { isLoading, updateEmail } = useUpdateEmail()
  // States
  const [email, setEmail] = useState(user?.email || "")
  const [newEmail, setNewEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const onSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    console.log(isEmail(newEmail), newEmail)
    if (!isEmail(newEmail)) return toast.error("Email is not valid")
    updateEmail(
      { email: newEmail, currentPassword },
      {
        onSuccess: () => {
          setNewEmail("")
          setCurrentPassword("")
        }
      }
    )
  }
  useEffect(() => {
    setEmail(user?.email || "")
  }, [user?.email])
  //
  return (
    <AContainer onSubmit={onSubmit}>
      <ARow>
        <Form.Label htmlFor="currentEmail">Current Email</Form.Label>
        <Form.Input
          id="currentEmail"
          name="Current Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={true}
        />
      </ARow>
      <ARow>
        <Form.Label htmlFor="email">New Email</Form.Label>
        <Form.Input
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          id="email"
          type="email"
          name="email"
          disabled={isLoading}
          required
        />
      </ARow>
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
      <Row direction="row" gap="2rem">
        <Button
          disabled={isLoading}
          size="medium"
          variation="priamry"
          type="submit"
        >
          Update Email
        </Button>
      </Row>
    </AContainer>
  )
}

export default UpdateEmailForm
