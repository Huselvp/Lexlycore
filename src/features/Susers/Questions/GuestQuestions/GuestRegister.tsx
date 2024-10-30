import { FormEventHandler, useState } from "react";
import { useRegister } from "../../../../features/Authentication/useRegister";
import isEmail from "validator/lib/isEmail";
import Form from "../../../../ui/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import SpinnerMini from "../../../../ui/SpinnerMini";
import toast from "react-hot-toast";
import InputPassword from "../../../../ui/InputPassword";
import { API } from "../../../../utils/constants";
import { getApiConfig } from "../../../../utils/constants";
import axios from "axios";
import { setToken } from "../../../../utils/helpers";

const GuestRegister = () => {
  const { isLoading } = useRegister();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const navigate = useNavigate(); // For navigation after registration

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
      window.location.href = `/pay?p=${paymentData.paymentId}&d=${paymentData.documentId}&t=${paymentData.templateId}`;
    } catch (error) {
      console.error("Failed to initiate payment:", error);
    }
  };

  const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    // check if email is valid
    if (!isEmail(email)) return toast.error("Email is not valid");
    // check if passwords match
    if (password !== passwordConfirm)
      return toast.error("Passwords must match");

    // setLoading(true); // Set loading state

    try {
      // Register the user
      const registerRes = await axios.post(
        `${API}/auth/register`,
        { firstname, lastname, username, email, password, role: "SUSER" },
        getApiConfig()
      );

      // Handle access_token and store it (similar to login)
      const accessToken = registerRes.data.access_token; // Adjust this line based on the API response structure
      localStorage.setItem("access_token", accessToken); // Store the token in localStorage
      // Optionally, set the token in your authentication context/store

      setToken(accessToken);

      const templateId = localStorage.getItem("templateId");

      // Create the document after registration
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
        { isDraft: false, values: finalData, documentId },
        getApiConfig()
      );

      // Now that documentId is available, start the payment process
      await startPaymentProcess(parseInt(templateId), documentId);

      // Redirect user after successful registration (optional)
      navigate("/dashboard"); // or wherever you want to redirect the user
    } catch (error: any) {
      console.error("Error occurred:", error.message || error);
      toast.error("Registration failed, please try again.");
    } finally {
      // setLoading(false); // Reset loading state
    }
  };

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
                onChange={(e) => setFirstname(e.target.value)}
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
                onChange={(e) => setLastname(e.target.value)}
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
              onChange={(e) => setUsername(e.target.value)}
              id="username"
              type="text"
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
                setValue={setPassword}
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
                setValue={setPasswordConfirm}
                name="confirmpassword"
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
            <Link to="/login/guest">Log in here</Link>
          </Form.Row>
        </Form.Rows>
      </Form>
    </>
  );
};

export default GuestRegister;
