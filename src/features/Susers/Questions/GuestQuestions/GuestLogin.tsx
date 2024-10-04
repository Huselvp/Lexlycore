// import Form from "../../../../ui/AuthForm";
// import { Link, useNavigate } from "react-router-dom";
// import { FormEventHandler, useState } from "react";
// import SpinnerMini from "../../../../ui/SpinnerMini";
// import styled from "styled-components";
// import InputPassword from "../../../../ui/InputPassword";
// import { API } from "../../../../utils/constants";
// import { getApiConfig } from "../../../../utils/constants";

// import { removeToken, setToken } from "../../../../utils/helpers";

// import axios from "axios";

// const P = styled.p`
//   cursor: pointer;
//   color: var(--color-stone-500);
//   font-weight: 500;
//   font-size: 1.2rem;
//   &:hover {
//     color: var(--color-stone-550);
//   }
//   /* text-align: center; */
// `;

// const GuestLogin = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // Function to generate the payment URL
//   const initiatePaymentUrl = (templateId: number): string =>
//     `${API}/suser/initiate-payment/${templateId}`;

//   // Function to initiate payment
//   const initiatePayment = async (data: {
//     templateId: number;
//     documentId: number;
//   }) => {
//     try {
//       const response = await axios.get(
//         initiatePaymentUrl(data.templateId),
//         getApiConfig()
//       );
//       console.log("Response: ", response);

//       // Extract paymentId from response
//       const paymentId = JSON.parse(response.data.data).paymentId;
//       console.log("paymentId = ", paymentId);

//       // Return the processed payment data
//       return {
//         templateId: data.templateId,
//         documentId: data.documentId,
//         paymentId: paymentId,
//       };
//     } catch (error) {
//       console.error("Error initiating payment", error);
//       throw error; // Propagate error to the caller
//     }
//   };

//   // Hook to handle the initiation of payment
//   const useInitiatePayment = (templateId: number, documentId: number) => {
//     const navigate = useNavigate();

//     // Handler to initiate payment
//     const startPaymentProcess = async (initData?: {
//       templateId: number;
//       documentId: number;
//     }) => {
//       try {
//         // Initiate payment using either initData or passed templateId/documentId
//         const paymentData = await initiatePayment({
//           templateId: initData?.templateId || templateId,
//           documentId: initData?.documentId || documentId,
//         });

//         // Navigate to the payment page with the returned data
//         navigate(
//           `/pay?p=${paymentData.paymentId}&d=${paymentData.documentId}&t=${paymentData.templateId}`
//         );
//       } catch (error) {
//         // Handle the error gracefully, log it or display an error message
//         console.error("Failed to initiate payment:", error);
//       }
//     };

//     // Return the handler for initiating payment
//     return { startPaymentProcess };
//   };

//   // =========================

//   const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
//     event.preventDefault(); // Prevent form submission

//     try {
//       // First, make the login API call
//       const loginRes = await axios.post(
//         `${API}/auth/login`,
//         {
//           email: email, // Email and password sent to the API
//           password: password,
//         },
//         getApiConfig() // API config (headers)
//       );

//       const { access_token, error_message } = loginRes.data; // Destructure response data

//       if (error_message) {
//         throw new Error(error_message); // Handle API error
//       }

//       setToken(access_token); // Save the token

//       // After login, create the document
//       const templateId = localStorage.getItem("templateId");
//       const createDocRes = await axios.post(
//         `${API}/suser/createDocument/${templateId}`,
//         {}, // Pass an empty object or appropriate data if needed
//         getApiConfig() // API config (headers)
//       );

//       const documentId = createDocRes.data.documentId; // Get document ID from response

//       console.log(documentId);

//       const storedValues = JSON.parse(
//         localStorage.getItem("documentValues") || "[]"
//       ); // Fetch stored document values

//       // Helper function to process questions
//       const processQuestions = (questions, isSubQuestion = false) => {
//         return questions.map((question) => {
//           const idKey = isSubQuestion ? "subQuestionId" : "questionId"; // Dynamic key selection for question ID
//           const valueKey = "value"; // Common value key for all types

//           let processedQuestion: any = {
//             [idKey]: question[idKey], // Set the ID
//           };

//           // Process based on question type
//           switch (question.type) {
//             case "form":
//               processedQuestion.formValues = Array.isArray(question[valueKey])
//                 ? question[valueKey].map(
//                     ({ blockId, labelId, LabelValue }) => ({
//                       blockId,
//                       labelId,
//                       LabelValue,
//                     })
//                   )
//                 : [];
//               break;
//             case "time":
//               if (
//                 Array.isArray(question[valueKey]) &&
//                 question[valueKey].length >= 2
//               ) {
//                 processedQuestion.firstTimeValues = question[valueKey][0]?.time;
//                 processedQuestion.secondTimeValue = question[valueKey][1]?.time;
//               }
//               break;
//             case "checkbox":
//               processedQuestion.checkboxValue = Array.isArray(
//                 question[valueKey]
//               )
//                 ? question[valueKey]
//                 : [question[valueKey]];
//               break;
//             case "day":
//               processedQuestion.days = Array.isArray(question[valueKey])
//                 ? question[valueKey].map(({ index, day }) => ({ index, day }))
//                 : [];
//               break;
//             case "map":
//               const mapString = question[valueKey] || "";
//               const mapParts = mapString.split(",").map((part) => part.trim());
//               processedQuestion.mapValues = mapParts.reduce(
//                 (acc, value, index) => {
//                   acc[index + 1] = value;
//                   return acc;
//                 },
//                 {}
//               );
//               break;
//             default:
//               processedQuestion.value = question[valueKey];
//           }

//           // Recursively process subquestions
//           if (
//             Array.isArray(question.subquestionsValues) &&
//             question.subquestionsValues.length > 0
//           ) {
//             processedQuestion.subquestionsValues = processQuestions(
//               question.subquestionsValues,
//               true
//             );
//           }

//           return processedQuestion;
//         });
//       };

//       // Process the stored values
//       const finalData = processQuestions(storedValues);

//       // Send the processed values to the server
//       const addValuesRes = await axios.post(
//         `${API}/suser/add-values`,
//         {
//           isDraft: false, // You can make this dynamic if needed
//           values: finalData,
//           documentId,
//         },
//         getApiConfig() // API config (headers)
//       );

//       console.log("Data saved successfully:", addValuesRes.data); // Success message

//       // Call the useInitiatePayment function after successfully adding values
//       const { startPaymentProcess } = useInitiatePayment(
//         parseInt(templateId), // Ensure templateId is a number
//         documentId
//       );

//       // Trigger payment initiation
//       await startPaymentProcess();
//     } catch (error: any) {
//       console.error("Error occurred:", error.message || error); // Error handling
//     }
//   };

//   return (
//     <>
//       <Form onSubmit={onFormSubmit}>
//         <h3>Log in</h3>
//         <Form.Rows>
//           <Form.Row>
//             <Form.Label htmlFor="email">Email</Form.Label>
//             <Form.Input
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               type="email"
//               id="email"
//               name="email"
//               required
//               disabled={isLoading}
//             />
//           </Form.Row>
//           <Form.Row>
//             <Form.LabelContainer>
//               <Form.Label htmlFor="password">Password</Form.Label>
//               <P onClick={() => navigate("/forgotPassword")}>
//                 Forgot Password?
//               </P>
//             </Form.LabelContainer>
//             <InputPassword
//               value={password}
//               setValue={setPassword}
//               id="password"
//               disabled={isLoading}
//               name="password"
//             />
//           </Form.Row>
//           <Form.Row>
//             <Form.Button disabled={isLoading}>
//               {isLoading ? <SpinnerMini /> : "Login"}
//             </Form.Button>
//           </Form.Row>
//           <Form.Row addborder={true}>
//             <p>Don't have an account ?</p>
//             <Link to="/register/guest">Register</Link>
//           </Form.Row>
//         </Form.Rows>
//       </Form>
//     </>
//   );
// };

// export default GuestLogin;

// import Form from "../../../../ui/AuthForm";
// import { Link, useNavigate } from "react-router-dom";
// import { FormEventHandler, useState } from "react";
// import SpinnerMini from "../../../../ui/SpinnerMini";
// import styled from "styled-components";
// import InputPassword from "../../../../ui/InputPassword";
// import { API } from "../../../../utils/constants";
// import { getApiConfig } from "../../../../utils/constants";
// import { removeToken, setToken } from "../../../../utils/helpers";
// import axios from "axios";

// const P = styled.p`
//   cursor: pointer;
//   color: var(--color-stone-500);
//   font-weight: 500;
//   font-size: 1.2rem;
//   &:hover {
//     color: var(--color-stone-550);
//   }
// `;

// const GuestLogin = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Function to generate the payment URL
//   const initiatePaymentUrl = (templateId: number): string =>
//     `${API}/suser/initiate-payment/${templateId}`;

//   // Function to initiate payment
//   const initiatePayment = async (data: {
//     templateId: number;
//     documentId: number;
//   }) => {
//     try {
//       const response = await axios.get(
//         initiatePaymentUrl(data.templateId),
//         getApiConfig()
//       );
//       const paymentId = JSON.parse(response.data.data).paymentId;
//       return {
//         templateId: data.templateId,
//         documentId: data.documentId,
//         paymentId: paymentId,
//       };
//     } catch (error) {
//       console.error("Error initiating payment", error);
//       throw error;
//     }
//   };

//   // Custom hook for initiating payment
//   const useInitiatePayment = (templateId: number, documentId: number) => {
//     const startPaymentProcess = async () => {
//       try {
//         const paymentData = await initiatePayment({ templateId, documentId });
//         navigate(
//           `/pay?p=${paymentData.paymentId}&d=${paymentData.documentId}&t=${paymentData.templateId}`
//         );
//       } catch (error) {
//         console.error("Failed to initiate payment:", error);
//       }
//     };

//     return { startPaymentProcess };
//   };

//   // Get templateId and documentId at the top level
//   const templateId = parseInt(localStorage.getItem("templateId") || "0");
//   const { startPaymentProcess } = useInitiatePayment(templateId, 0);

//   const onFormSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);

//     try {
//       const loginRes = await axios.post(
//         `${API}/auth/login`,
//         { email, password },
//         getApiConfig()
//       );
//       const { access_token, error_message } = loginRes.data;

//       if (error_message) throw new Error(error_message);
//       setToken(access_token);

//       const createDocRes = await axios.post(
//         `${API}/suser/createDocument/${templateId}`,
//         {},
//         getApiConfig()
//       );
//       const documentId = createDocRes.data.documentId;

//       const storedValues = JSON.parse(
//         localStorage.getItem("documentValues") || "[]"
//       );

//       const processQuestions = (questions, isSubQuestion = false) => {
//         return questions.map((question) => {
//           const idKey = isSubQuestion ? "subQuestionId" : "questionId";
//           let processedQuestion = { [idKey]: question[idKey] };

//           switch (question.type) {
//             case "form":
//               processedQuestion.formValues = question.value.map(
//                 ({ blockId, labelId, LabelValue }) => ({
//                   blockId,
//                   labelId,
//                   LabelValue,
//                 })
//               );
//               break;
//             case "time":
//               processedQuestion.firstTimeValues = question.value[0]?.time;
//               processedQuestion.secondTimeValue = question.value[1]?.time;
//               break;
//             case "checkbox":
//               processedQuestion.checkboxValue = Array.isArray(question.value)
//                 ? question.value
//                 : [question.value];
//               break;
//             case "day":
//               processedQuestion.days = question.value.map(({ index, day }) => ({
//                 index,
//                 day,
//               }));
//               break;
//             case "map":
//               processedQuestion.mapValues = question.value
//                 .split(",")
//                 .map((part) => part.trim());
//               break;
//             default:
//               processedQuestion.value = question.value;
//           }

//           if (question.subquestionsValues?.length > 0) {
//             processedQuestion.subquestionsValues = processQuestions(
//               question.subquestionsValues,
//               true
//             );
//           }

//           return processedQuestion;
//         });
//       };

//       const finalData = processQuestions(storedValues);
//       await axios.post(
//         `${API}/suser/add-values`,
//         { isDraft: false, values: finalData, documentId },
//         getApiConfig()
//       );

//       // Now that the documentId is known, update startPaymentProcess with the correct documentId
//       await startPaymentProcess(documentId);
//     } catch (error) {
//       console.error("Error occurred:", error.message || error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Form onSubmit={onFormSubmit}>
//       <h3>Log in</h3>
//       <Form.Rows>
//         <Form.Row>
//           <Form.Label htmlFor="email">Email</Form.Label>
//           <Form.Input
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             type="email"
//             id="email"
//             name="email"
//             required
//             disabled={isLoading}
//           />
//         </Form.Row>
//         <Form.Row>
//           <Form.LabelContainer>
//             <Form.Label htmlFor="password">Password</Form.Label>
//             <P onClick={() => navigate("/forgotPassword")}>Forgot Password?</P>
//           </Form.LabelContainer>
//           <InputPassword
//             value={password}
//             setValue={setPassword}
//             id="password"
//             disabled={isLoading}
//             name="password"
//           />
//         </Form.Row>
//         <Form.Row>
//           <Form.Button disabled={isLoading}>
//             {isLoading ? <SpinnerMini /> : "Login"}
//           </Form.Button>
//         </Form.Row>
//         <Form.Row addborder={true}>
//           <p>Don't have an account?</p>
//           <Link to="/register/guest">Register</Link>
//         </Form.Row>
//       </Form.Rows>
//     </Form>
//   );
// };

// export default GuestLogin;

import Form from "../../../../ui/AuthForm";
import { Link, useNavigate } from "react-router-dom";
import { FormEventHandler, useState } from "react";
import SpinnerMini from "../../../../ui/SpinnerMini";
import styled from "styled-components";
import InputPassword from "../../../../ui/InputPassword";
import { API } from "../../../../utils/constants";
import { getApiConfig } from "../../../../utils/constants";

import { removeToken, setToken } from "../../../../utils/helpers";

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
      console.log("Response: ", response);

      // Extract paymentId from response
      const paymentId = JSON.parse(response.data.data).paymentId;
      console.log("paymentId = ", paymentId);

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

      console.log(documentId);

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
      const addValuesRes = await axios.post(
        `${API}/suser/add-values`,
        {
          isDraft: false,
          values: finalData,
          documentId,
        },
        getApiConfig()
      );

      console.log("Data saved successfully:", addValuesRes.data);

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
            <p>Don't have an account?</p>
            <Link to="/register/guest">Register</Link>
          </Form.Row>
        </Form.Rows>
      </Form>
    </>
  );
};

export default GuestLogin;
