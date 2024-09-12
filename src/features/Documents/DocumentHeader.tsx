// import styled from "styled-components";
// import Logo from "../../ui/Logo";
// import { FaSave as SaveIcon } from "react-icons/fa";
// import { useAddUpdateDocumentQuestion } from "./useAddUpdateDocumentQuestion";
// import { useNavigate } from "react-router-dom";

// import axios from "axios";
// import { API } from "../../utils/constants";
// import { getApiConfig } from "../../utils/constants";
// import { useParams } from "react-router-dom";

// const Header = styled.div`
//   background-color: var(--white);
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   border-bottom: 1px solid var(--color-grey-200);
//   padding: 1rem 2rem;
//   font-size: 1.2rem;
//   font-weight: 400;
//   button {
//     color: var(--color-stone-500);
//     background: none;
//     border: none;
//     display: flex;
//     align-items: center;
//     gap: 0.5rem;
//     border: 1px solid currentColor;
//     padding: 1rem;
//     border-radius: var(--rounded);
//     font-weight: 500;
//     &:hover {
//       color: var(--color-stone-600);
//     }
//   }
// `;
// const DocumentHeader = ({
//   isDraft,
//   overviewData,
// }: {
//   isDraft: boolean;
//   overviewData: {
//     questionText: string;
//     questionId: number;
//     value: string | number;
//     active: boolean;
//   }[];
// }) => {
//   const { isLoading, addUpdateDocumentQuestion } =
//     useAddUpdateDocumentQuestion();
//   const navigate = useNavigate();

//   const clickHandler = () => {
//     const values = overviewData.filter((item) => {
//       if (item.value) return { questionId: item.questionId, value: item.value };
//     });

//     const processQuestions = (questions, isSubQuestion = false) => {
//       return questions.map((question) => {
//         // Determine the correct ID key based on whether it's a subquestion or not
//         const idKey = isSubQuestion ? "subQuestionId" : "questionId";
//         const valueKey = "value";

//         let processedQuestion = {
//           [idKey]: question[idKey], // Use the appropriate key for ID
//         };

//         if (question.type === "form") {
//           const formValues = Array.isArray(question[valueKey])
//             ? question[valueKey].map(({ blockId, labelId, LabelValue }) => ({
//                 blockId,
//                 labelId,
//                 LabelValue,
//               }))
//             : [];
//           processedQuestion.formValues = formValues;
//         } else if (question.type === "time") {
//           if (
//             Array.isArray(question[valueKey]) &&
//             question[valueKey].length >= 2
//           ) {
//             processedQuestion.firstTimeValue = question[valueKey][0]?.time;
//             processedQuestion.secondTimeValue = question[valueKey][1]?.time;
//           }
//         } else if (question.type === "checkbox") {
//           const checkboxValues = Array.isArray(question[valueKey])
//             ? question[valueKey]
//             : [question[valueKey]];
//           processedQuestion.checkboxValues = checkboxValues;
//         } else if (question.type === "day") {
//           const days = Array.isArray(question[valueKey])
//             ? question[valueKey].map(({ index, day }) => ({
//                 index,
//                 day,
//               }))
//             : [];
//           processedQuestion.days = days;
//         } else {
//           processedQuestion.value = question[valueKey];
//         }

//         // Process subQuestions recursively and pass true for isSubQuestion
//         if (
//           Array.isArray(question.subQuestions) &&
//           question.subQuestions.length > 0
//         ) {
//           processedQuestion.subQuestions = processQuestions(
//             question.subQuestions,
//             true
//           );
//         }

//         return processedQuestion;
//       });
//     };

//     const orderMyData = (data) => {
//       return processQuestions(data);
//     };

//     // Process and log data
//     const finalData = orderMyData(values);

//     console.log(
//       overviewData,
//       "66666666666666666666666666666666666666666666666666666666"
//     );

//     const params = useParams();

//     const documentId = params.documentId;

//     axios
//       .post(
//         `${API}/admin/save-progress/${documentId}`, // URL with documentId in path
//         finalData, // Data to send in the body
//         getApiConfig() // Configuration, such as headers or additional options
//       )
//       .then((result) => {
//         console.log(
//           result.data,
//           "----------------------------------------------------------------------------------------"
//         );
//       });

//     addUpdateDocumentQuestion(
//       { isDraft, values },
//       {
//         onSuccess: () => navigate("/u/documents"),
//       }
//     );
//   };

//   return (
//     <Header>
//       <Logo />
//       <button disabled={isLoading} onClick={clickHandler}>
//         <span>{isLoading ? "Loading..." : "Continue later"}</span>
//         <SaveIcon />
//       </button>
//     </Header>
//   );
// };

// export default DocumentHeader;

import styled from "styled-components";
import Logo from "../../ui/Logo";
import { FaSave as SaveIcon } from "react-icons/fa";
import { useAddUpdateDocumentQuestion } from "./useAddUpdateDocumentQuestion";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import { API } from "../../utils/constants";
import { getApiConfig } from "../../utils/constants";

const Header = styled.div`
  background-color: var(--white);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--color-grey-200);
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 400;
  button {
    color: var(--color-stone-500);
    background: none;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid currentColor;
    padding: 1rem;
    border-radius: var(--rounded);
    font-weight: 500;
    &:hover {
      color: var(--color-stone-600);
    }
  }
`;

const DocumentHeader = ({
  isDraft,
  overviewData,
}: {
  isDraft: boolean;
  overviewData: {
    questionText: string;
    questionId: number;
    value: string | number;
    active: boolean;
  }[];
}) => {
  const { isLoading, addUpdateDocumentQuestion } =
    useAddUpdateDocumentQuestion();
  const navigate = useNavigate();
  const params = useParams(); // Move this hook to the component body
  const documentId = params.documentId;

  const clickHandler = () => {
    const values = overviewData.filter((item) => {
      if (item.value) return { questionId: item.questionId, value: item.value };
    });

    const processQuestions = (questions, isSubQuestion = false) => {
      return questions.map((question) => {
        const idKey = isSubQuestion ? "subQuestionId" : "questionId";
        const valueKey = "value";

        let processedQuestion = {
          [idKey]: question[idKey],
        };

        if (question.type === "form") {
          const formValues = Array.isArray(question[valueKey])
            ? question[valueKey].map(({ blockId, labelId, LabelValue }) => ({
                blockId,
                labelId,
                LabelValue,
              }))
            : [];
          processedQuestion.formValues = formValues;
        } else if (question.type === "time") {
          if (
            Array.isArray(question[valueKey]) &&
            question[valueKey].length >= 2
          ) {
            processedQuestion.firstTimeValue = question[valueKey][0]?.time;
            processedQuestion.secondTimeValue = question[valueKey][1]?.time;
          }
        } else if (question.type === "checkbox") {
          const checkboxValues = Array.isArray(question[valueKey])
            ? question[valueKey]
            : [question[valueKey]];
          processedQuestion.checkboxValues = checkboxValues;
        } else if (question.type === "day") {
          const days = Array.isArray(question[valueKey])
            ? question[valueKey].map(({ index, day }) => ({
                index,
                day,
              }))
            : [];
          processedQuestion.days = days;
        } else {
          processedQuestion.value = question[valueKey];
        }

        if (
          Array.isArray(question.subQuestions) &&
          question.subQuestions.length > 0
        ) {
          processedQuestion.subQuestions = processQuestions(
            question.subQuestions,
            true
          );
        }

        return processedQuestion;
      });
    };

    const orderMyData = (data) => {
      return processQuestions(data);
    };

    const finalData = orderMyData(values);

    const getLastNonEmptyQuestionId = (questions) => {
      let lastQuestionId = null;

      questions.forEach((question) => {
        const idKey = "questionId";
        const valueKey = "value";

        const hasValidValue = (value) => {
          return value !== null && value !== ""; // Check if value is not null or an empty string
        };

        // Check if the current question has a valid value
        if (hasValidValue(question[valueKey])) {
          lastQuestionId = question[idKey];
        }
      });

      // Return the last valid question ID found
      return lastQuestionId;
    };

    const lastQuestionId = getLastNonEmptyQuestionId(finalData);

    // console.log(
    //   overviewData,
    //   "66666666666666666666666666666666666666666666666666666666"
    // );

    console.log(
      lastQuestionId,
      "66666666666666666666666666666666666666666666666666666666"
    );

    axios
      .post(
        `${API}/suser/save-progress/${documentId}`, // Use the documentId from the hook
        {
          documentId: documentId,
          lastAnsweredQuestionId: lastQuestionId,
          values: finalData,
        }, // Data to send in the body
        getApiConfig() // Configuration, such as headers or additional options
      )
      .then((result) => {
        console.log(
          result.data,
          "----------------------------------------------------------------------------------------"
        );
        navigate("/u/documents");
      });

    // addUpdateDocumentQuestion(
    //   { isDraft, values },
    //   {
    //     onSuccess: () => navigate("/u/documents"),
    //   }
    // );
  };

  return (
    <Header>
      <Logo />
      <button disabled={isLoading} onClick={clickHandler}>
        <span>{isLoading ? "Loading..." : "Continue later"}</span>
        <SaveIcon />
      </button>
    </Header>
  );
};

export default DocumentHeader;
