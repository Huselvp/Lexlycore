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
        const processQuestions = (questions, isSubQuestion = false) => {
          return questions.map((question) => {
            // Determine the correct ID key based on whether it's a subquestion or not
            const idKey = isSubQuestion ? "subQuestionId" : "questionId";
            const valueKey = "value";

            let processedQuestion = {
              [idKey]: question[idKey], // Use the appropriate key for ID
            };

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
              processedQuestion.formValues = formValues;
            } else if (question.type === "time") {
              if (
                Array.isArray(question[valueKey]) &&
                question[valueKey].length >= 2
              ) {
                processedQuestion.firstTimeValues = question[valueKey][0]?.time;
                processedQuestion.secondTimeValue = question[valueKey][1]?.time;
              }
            } else if (question.type === "checkbox") {
              const checkboxValues = Array.isArray(question[valueKey])
                ? question[valueKey]
                : [question[valueKey]];
              processedQuestion.checkboxValue = checkboxValues;
            } else if (question.type === "day") {
              const days = Array.isArray(question[valueKey])
                ? question[valueKey].map(({ index, day }) => ({
                    index,
                    day,
                  }))
                : [];
              processedQuestion.days = days;
            } else if (question.type === "map") {
              // Split the map string by commas and trim each part
              const mapString = question[valueKey] || "";
              const mapParts = mapString.split(",").map((part) => part.trim());

              // Create mapValues object with keys as 1, 2, 3, etc.
              const mapValues = mapParts.reduce((acc, value, index) => {
                acc[index + 1] = value;
                return acc;
              }, {});

              processedQuestion.mapValues = mapValues;
            } else {
              processedQuestion.value = question[valueKey];
            }

            // Process subquestionsValues recursively and pass true for isSubQuestion
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

        const orderMyData = (data) => {
          return processQuestions(data);
        };

        // Process and log data
        const finalData = orderMyData(values);

        console.log(
          {
            isDraft,
            finalData,
            documentId,
          },
          "777777777777777777777777777777"
        );

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
