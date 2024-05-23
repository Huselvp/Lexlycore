import { FormEventHandler, useState } from "react"
import { useRegister } from "../features/Authentication/useRegister"
import isEmail from "validator/lib/isEmail"
import Form from "../ui/AuthForm"
import { Link } from "react-router-dom"
import SpinnerMini from "../ui/SpinnerMini"
import toast from "react-hot-toast"
import InputPassword from "../ui/InputPassword"
const Register = () => {
  const { isLoading, register } = useRegister()
  const [firstname, setfirstname] = useState("")
  const [lastname, setlastname] = useState("")
  const [username, setusername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setpassword] = useState("")
  const [passwordConfirm, setpasswordConfirm] = useState("")

  const onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    // check if email is valid
    if (!isEmail(email)) return toast.error("Email is not valid")
    // check if passwords match
    if (password !== passwordConfirm) return toast.error("Passwords must match")
    register({ firstname, lastname, username, email, password, role: "ADMIN" })
  
  }
  return (
    <>
      <Form onSubmit={onFormSubmit}>
        <h3>Create your account</h3>
        <Form.Rows>
          <Form.DoubleRow>
            <Form.Row>
              <Form.Label htmlFor="firstname">First name</Form.Label>
              <Form.Input
                disabled={isLoading}
                value={firstname}
                onChange={(e) => setfirstname(e.target.value)}
                id="firstname"
                type="text"
                required
                minLength={3}
              />
            </Form.Row>
            <Form.Row>
              <Form.Label htmlFor="lastname">Last name</Form.Label>
              <Form.Input
                disabled={isLoading}
                value={lastname}
                onChange={(e) => setlastname(e.target.value)}
                id="lastname"
                type="text"
                required
                minLength={3}
              />
            </Form.Row>
          </Form.DoubleRow>
          <Form.Row>
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Input
              disabled={isLoading}
              value={username}
              onChange={(e) => setusername(e.target.value)}
              id="username"
              type="string"
              required
            />
          </Form.Row>
          <Form.Row>
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Input
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              required
            />
          </Form.Row>
          <Form.DoubleRow>
            <Form.Row>
              <Form.Label htmlFor="password">Password</Form.Label>
              <InputPassword
                value={password}
                setValue={setpassword}
                name="password"
                id="password"
                disabled={isLoading}
                includeMinLength={true}
              />
            </Form.Row>
            <Form.Row>
              <Form.Label htmlFor="confirmpassword">
                Confirm Password
              </Form.Label>
              <InputPassword
                value={passwordConfirm}
                setValue={setpasswordConfirm}
                name="conxfirmpassword"
                id="confirmpassword"
                disabled={isLoading}
                includeMinLength={true}
              />
            </Form.Row>
          </Form.DoubleRow>

          <Form.Row>
            <Form.Button disabled={isLoading}>
              {isLoading ? <SpinnerMini /> : "Register"}
            </Form.Button>
          </Form.Row>
          <Form.Row addborder={true}>
            <p>Have an account ?</p>
            <Link to="/login">Sign in</Link>
          </Form.Row>
        </Form.Rows>
      </Form>
    </>
  )
}

export default Register
