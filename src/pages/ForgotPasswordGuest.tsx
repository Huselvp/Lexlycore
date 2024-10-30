import { FormEventHandler, useState } from "react";
import Form from "../ui/AuthForm";
import { useForgotPassword } from "../features/Authentication/useForgotPassword";
import SpinnerMini from "../ui/SpinnerMini";
import styled from "styled-components";
import Row from "../ui/Row";
import { Link } from "react-router-dom";
import { IoArrowBackSharp as ArrowLeftIcon } from "react-icons/io5";
import toast from "react-hot-toast";

import { getToken } from "../utils/helpers";

const P = styled.p`
  /* padding: 2rem 0; */
  font-weight: 500;
  color: var(--color-grey-500);
  /* text-align: center; */
`;
const GoBackToLogin = styled(Link)`
  margin-top: 3rem;
  color: var(--color-stone-650);
  display: flex;
  align-items: center;
  justify-content: center;
  /* font-size: 1.6rem; */
  font-weight: 500;
  gap: 0.5rem;
  &:hover {
    color: var(--color-stone-700);
  }
  svg {
    color: currentColor;
    display: block;
  }
  /* display: block; */
`;

const ForgotPasswordGuest = () => {
  const [linkWasSent, setLinkWasSent] = useState<boolean>(false);
  const { isLoading, forgotPassword } = useForgotPassword();
  const [email, setEmail] = useState("");
  const token = getToken();
  const onFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    forgotPassword(email, {
      onSuccess: () => {
        toast.success(
          `Password resent link was successfully ${
            linkWasSent ? "resent" : "sent"
          }`
        );
        setLinkWasSent(true);
      },
    });
  };

  return (
    <>
      {/* <Logo /> */}
      <Form onSubmit={onFormSubmit}>
        <h3>Forgot Password</h3>
        <Row direction="column" gap="2rem">
          <P>
            {/* Enter your user account's email address and we will send you a
            password reset link. */}
            {linkWasSent
              ? // ? "Password reset link was sent. If it doesn't show up, hit the 'Resend' button to give it another go."
                "In case it doesn't pop up in your inbox shortly, no worries! You can always hit the 'Resend' button below."
              : "Enter your email and you will receive a password reset link."}
          </P>
          <Form.Input
            disabled={linkWasSent || isLoading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="email"
            required
            minLength={3}
            placeholder="Enter your email address"
          />
          <Form.Button disabled={isLoading}>
            {isLoading ? (
              <SpinnerMini />
            ) : linkWasSent ? (
              "Resend"
            ) : (
              "Send password reset email"
            )}
          </Form.Button>
        </Row>
        <Row justify="center" direction="row" gap="0" align="center">
          <GoBackToLogin to={"/login/guest"}>
            <ArrowLeftIcon />
            <span>Back to log in</span>
          </GoBackToLogin>
        </Row>
      </Form>
    </>
  );
};

export default ForgotPasswordGuest;
