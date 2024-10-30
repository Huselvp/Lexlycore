import Form from "../../../../ui/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { FormEventHandler, useState } from "react";
import SpinnerMini from "../../../../ui/SpinnerMini";
import styled from "styled-components";
import InputPassword from "../../../../ui/InputPassword";
import { API } from "../../../../utils/constants";
import { getApiConfig } from "../../../../utils/constants";

import { setToken } from "../../../../utils/helpers";

import axios from "axios";

const P = styled.p`
  cursor: pointer;
  color: var(--color-stone-500);
  font-weight: 500;
  font-size: 1.2rem;
  &:hover {
    color: var(--color-stone-550);
  }
`;

const GuestLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for the form

  // Function to generate the payment URL
  const initiatePaymentUrl = (templateId: number): string =>
    `${API}/suser/initiate-payment/${templateId}`;

  // Function to initiate payment
  const initiatePayment = async (data: {
    templateId: number;
    documentId: number;
  }) => {
    try {
      const response = await axios.get(
        initiatePaymentUrl(data.templateId),
        getApiConfig()
      );

      // Extract paymentId from response
      const paymentId = JSON.parse(response.data.data).paymentId;

      // Return the processed payment data
      return {
        templateId: data.templateId,
        documentId: data.documentId,
        paymentId: paymentId,
      };
    } catch (error) {
      console.error("Error initiating payment", error);
      throw error;
    }
  };

  // Function to handle the initiation of payment
  const startPaymentProcess = async (
    templateId: number,
    documentId: number
  ) => {
    try {
      // Initiate payment using templateId and documentId
      const paymentData = await initiatePayment({ templateId, documentId });

      // Navigate to the payment page with the returned data
      navigate(
        `/pay?p=${paymentData.paymentId}&d=${paymentData.documentId}&t=${paymentData.templateId}`
      );
    } catch (error) {
      console.error("Failed to initiate payment:", error);
    }
  };

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Set loading state

    try {
      // First, make the login API call
      const loginRes = await axios.post(
        `${API}/auth/login`,
        {
          email: email,
          password: password,
        },
        getApiConfig()
      );

      const { access_token, error_message } = loginRes.data;

      if (error_message) {
        throw new Error(error_message);
      }

      setToken(access_token); // Save the token

      const templateId = localStorage.getItem("templateId");

      // After login, create the document
      const createDocRes = await axios.post(
        `${API}/suser/createDocument/${templateId}`,
        {},
        getApiConfig()
      );

      const documentId = createDocRes.data.documentId; // Get the documentId

      const storedValues = JSON.parse(
        localStorage.getItem("documentValues") || "[]"
      );

      // Helper function to process questions
      const processQuestions = (questions, isSubQuestion = false) => {
        return questions.map((question) => {
          const idKey = isSubQuestion ? "subQuestionId" : "questionId";
          const valueKey = "value";

          let processedQuestion: any = {
            [idKey]: question[idKey],
          };

          switch (question.type) {
            case "form":
              processedQuestion.formValues = Array.isArray(question[valueKey])
                ? question[valueKey].map(
                    ({ blockId, labelId, LabelValue }) => ({
                      blockId,
                      labelId,
                      LabelValue,
                    })
                  )
                : [];
              break;
            case "time":
              if (
                Array.isArray(question[valueKey]) &&
                question[valueKey].length >= 2
              ) {
                processedQuestion.firstTimeValues = question[valueKey][0]?.time;
                processedQuestion.secondTimeValue = question[valueKey][1]?.time;
              }
              break;
            case "checkbox":
              processedQuestion.checkboxValue = Array.isArray(
                question[valueKey]
              )
                ? question[valueKey]
                : [question[valueKey]];
              break;
            case "day":
              processedQuestion.days = Array.isArray(question[valueKey])
                ? question[valueKey].map(({ index, day }) => ({ index, day }))
                : [];
              break;
            case "map":
              const mapString = question[valueKey] || "";
              const mapParts = mapString.split(",").map((part) => part.trim());
              processedQuestion.mapValues = mapParts.reduce(
                (acc, value, index) => {
                  acc[index + 1] = value;
                  return acc;
                },
                {}
              );
              break;
            default:
              processedQuestion.value = question[valueKey];
          }

          if (
            Array.isArray(question.subquestionsValues) &&
            question.subquestionsValues.length > 0
          ) {
            processedQuestion.subquestionsValues = processQuestions(
              question.subquestionsValues,
              true
            );
          }

          return processedQuestion;
        });
      };

      const finalData = processQuestions(storedValues);

      // Send the processed values to the server
      await axios.post(
        `${API}/suser/add-values`,
        {
          isDraft: false,
          values: finalData,
          documentId,
        },
        getApiConfig()
      );

      // Now that documentId is available, start the payment process
      await startPaymentProcess(parseInt(templateId), documentId);
    } catch (error: any) {
      console.error("Error occurred:", error.message || error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <>
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
              <P onClick={() => navigate("/forgotPassword/guest")}>
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
            <p>Don't have an account?</p>
            <Link to="/register/guest">Register</Link>
          </Form.Row>
        </Form.Rows>
      </Form>
    </>
  );
};

export default GuestLogin;
