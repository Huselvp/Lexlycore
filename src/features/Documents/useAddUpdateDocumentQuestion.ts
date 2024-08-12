// import { useMutation } from "@tanstack/react-query";
// import { addUpdateDocumentQuestion as addUpdateDocumentQuestionApi } from "../../services/documentApi";
// import {
//   displayErrorMessage,
//   transformParamToNumber,
// } from "../../utils/helpers";
// import { useParams } from "react-router-dom";

// export const useAddUpdateDocumentQuestion = () => {
//   const params = useParams();
//   const documentId = transformParamToNumber(params.documentId);

//   // const { isPending: isLoading, mutate: addUpdateDocumentQuestion } =
//   //   useMutation({
//   //     mutationFn: ({
//   //       isDraft,
//   //       values,
//   //     }: {
//   //       isDraft: boolean;
//   //       values: { questionId: number; value: string | number }[];
//   //     }) =>
//   //       addUpdateDocumentQuestionApi({
//   //         isDraft,
//   //         values,
//   //         documentId,
//   //       }),

//   //       console.log({
//   //         isDraft,
//   //         values,
//   //         documentId,
//   //       })

//   //     onError: displayErrorMessage,
//   //   });

//   const { isPending: isLoading, mutate: addUpdateDocumentQuestion } =
//     useMutation({
//       mutationFn: ({
//         isDraft,
//         values,
//       }: {
//         isDraft: boolean;
//         values: { questionId: number; value: string | number }[];
//       }) => {
//         console.log(
//           {
//             isDraft,
//             values,
//             documentId,
//           },
//           "MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM"
//         );

//         return addUpdateDocumentQuestionApi({
//           isDraft,
//           values,
//           documentId,
//         });
//       },
//       onError: displayErrorMessage,
//     });

//   return { isLoading, addUpdateDocumentQuestion };
// };

import { useMutation } from "@tanstack/react-query";
import { addUpdateDocumentQuestion as addUpdateDocumentQuestionApi } from "../../services/documentApi";
import {
  displayErrorMessage,
  transformParamToNumber,
} from "../../utils/helpers";
import { useParams } from "react-router-dom";

export const useAddUpdateDocumentQuestion = () => {
  const params = useParams();
  const documentId = transformParamToNumber(params.documentId);

  const { isPending: isLoading, mutate: addUpdateDocumentQuestion } =
    useMutation({
      mutationFn: async ({
        isDraft,
        values,
      }: {
        isDraft: boolean;
        values: any[]; // Adjusted type to handle the array of question objects
      }) => {
        // Function to process questions
        // const processQuestions = (questions, isSubQuestion = false) => {
        //   const processedData = [];

        //   questions.forEach((question) => {
        //     const idKey = isSubQuestion ? "subQuestionId" : "questionId";
        //     const valueKey = isSubQuestion ? "subQuestionValue" : "value";

        //     if (question.type === "form") {
        //       const formValues = Array.isArray(question[valueKey])
        //         ? question[valueKey].map(
        //             ({ blockId, labelId, LabelValue }) => ({
        //               blockId,
        //               labelId,
        //               LabelValue,
        //             })
        //           )
        //         : [];

        //       processedData.push({
        //         [idKey]: question[idKey],
        //         formValues,
        //       });
        //     } else if (question.type === "time") {
        //       if (
        //         Array.isArray(question[valueKey]) &&
        //         question[valueKey].length >= 2
        //       ) {
        //         processedData.push({
        //           [idKey]: question[idKey],
        //           firstTimeValues: question[valueKey][0]?.time,
        //           secondTimeValue: question[valueKey][1]?.time,
        //         });
        //       }
        //     } else if (question.type === "checkbox") {
        //       const checkboxValues = Array.isArray(question[valueKey])
        //         ? question[valueKey]
        //         : [question[valueKey]];

        //       processedData.push({
        //         checkboxValue: checkboxValues,
        //         [idKey]: question[idKey],
        //       });
        //     } else if (question.type === "day") {
        //       const days = Array.isArray(question[valueKey])
        //         ? question[valueKey].map(({ index, day }) => ({
        //             index,
        //             day,
        //           }))
        //         : [];

        //       processedData.push({
        //         [idKey]: question[idKey],
        //         days: days,
        //       });
        //     } else {
        //       processedData.push({
        //         [idKey]: question[idKey],
        //         value: question[valueKey],
        //       });
        //     }

        //     // Process subQuestions
        //     if (question.subQuestions && question.subQuestions.length > 0) {
        //       const processedSubQuestions = processQuestions(
        //         question.subQuestions,
        //         true // indicates that we are processing subquestions
        //       );
        //       processedData.push({
        //         [idKey]: question[idKey],
        //         subQuestions: processedSubQuestions,
        //       });
        //     }
        //   });

        //   return processedData;
        // };

        // const orderMyData = (data) => {
        //   return processQuestions(data);
        // };

        const processQuestions = (questions, isSubQuestion = false) => {
          const processedData = [];

          questions.forEach((question) => {
            const idKey = "questionId";
            const valueKey = "value";

            if (question.type === "form") {
              const formValues = Array.isArray(question[valueKey])
                ? question[valueKey].map(
                    ({ blockId, labelId, LabelValue }) => ({
                      blockId,
                      labelId,
                      LabelValue,
                    })
                  )
                : [];

              processedData.push({
                [idKey]: question[idKey],
                formValues,
              });
            } else if (question.type === "time") {
              if (
                Array.isArray(question[valueKey]) &&
                question[valueKey].length >= 2
              ) {
                processedData.push({
                  [idKey]: question[idKey],
                  firstTimeValues: question[valueKey][0]?.time,
                  secondTimeValue: question[valueKey][1]?.time,
                });
              }
            } else if (question.type === "checkbox") {
              const checkboxValues = Array.isArray(question[valueKey])
                ? question[valueKey]
                : [question[valueKey]];

              processedData.push({
                checkboxValue: checkboxValues,
                [idKey]: question[idKey],
              });
            } else if (question.type === "day") {
              const days = Array.isArray(question[valueKey])
                ? question[valueKey].map(({ index, day }) => ({
                    index,
                    day,
                  }))
                : [];

              processedData.push({
                [idKey]: question[idKey],
                days,
              });
            } else {
              processedData.push({
                [idKey]: question[idKey],
                value: question[valueKey],
              });
            }

            // Process subquestionsValues recursively
            if (
              Array.isArray(question.subquestionsValues) &&
              question.subquestionsValues.length > 0
            ) {
              const processedSubQuestions = processQuestions(
                question.subquestionsValues,
                true // indicates that we are processing subquestions
              );

              processedData.push({
                [idKey]: question[idKey],
                subquestionsValues: processedSubQuestions,
              });
            }
          });

          return processedData;
        };

        const orderMyData = (data) => {
          return processQuestions(data);
        };

        // Process and log data
        const finalData = orderMyData(values);

        console.log({
          isDraft,
          finalData,
          documentId,
        });

        // Make the API call
        return addUpdateDocumentQuestionApi({
          isDraft,
          values: finalData, // Ensure finalData is passed here
          documentId,
        });
      },
      onError: displayErrorMessage,
    });

  return { isLoading, addUpdateDocumentQuestion };
};
