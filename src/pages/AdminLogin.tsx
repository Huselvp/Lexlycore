import Form from "../ui/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { FormEventHandler, useState } from "react";
import { useAdminLogin } from "../features/Authentication/useAdminLogin";
import SpinnerMini from "../ui/SpinnerMini";
import styled from "styled-components";
import InputPassword from "../ui/InputPassword";

const P = styled.p`
  cursor: pointer;
  color: var(--color-stone-500);
  font-weight: 500;
  font-size: 1.2rem;
  &:hover {
    color: var(--color-stone-550);
  }
  /* text-align: center; */
`;

const AdminLogin = () => {
  const navigate = useNavigate();
  const { isLoading, login } = useAdminLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    login({ email, password });
    console.log("email: ", email, "password : ", password);
  };
  return (
    <>
      {/* <Form.Header> */}
      {/* <Logo /> */}
      {/* <Link to="/login">
          <SuitecaseIcon />
          <span>Log in as an advisor</span>
        </Link> */}
      {/* </Form.Header> */}
      <Form onSubmit={onFormSubmit}>
        <h3>Log in</h3>
        <Form.Rows>
          <Form.Row>
            <Form.Label htmlFor="email">Email</Form.Label>
            <Form.Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              required
              disabled={isLoading}
            />
          </Form.Row>
          <Form.Row>
            <Form.LabelContainer>
              <Form.Label htmlFor="password">Password</Form.Label>
              <P onClick={() => navigate("/forgotPassword")}>
                Forgot Password?
              </P>
            </Form.LabelContainer>
            <InputPassword
              value={password}
              setValue={setPassword}
              id="password"
              disabled={isLoading}
              name="password"
            />
          </Form.Row>
          <Form.Row>
            <Form.Button disabled={isLoading}>
              {isLoading ? <SpinnerMini /> : "Login"}
            </Form.Button>
          </Form.Row>
          <Form.Row addborder={true}>
            <p>Don't have an account ?</p>
            <Link to="/register">Register</Link>
          </Form.Row>
        </Form.Rows>
      </Form>
    </>
  );
};

export default AdminLogin;
