import { useMutation } from "@tanstack/react-query";
import { addUpdateDocumentQuestion as addUpdateDocumentQuestionApi } from "../../../../services/documentApi";
import {
  displayErrorMessage,
  transformParamToNumber,
} from "../../../../utils/helpers";
import { useParams } from "react-router-dom";

export const guestUseAddUpdateDocumentQuestion = () => {
  const params = useParams();
  const documentId = transformParamToNumber(params.documentId);

  const { isPending: isLoading, mutate: addUpdateDocumentQuestion } =
    useMutation({
      mutationFn: async ({
        isDraft,
        values,
      }: {
        isDraft: boolean;
        values: any[];
      }) => {
        const processQuestions = (questions, isSubQuestion = false) => {
          return questions.map((question) => {
            // Always use 'questionId' as the key regardless of whether it's a subquestion
            const idKey = "questionId";
            const valueKey = "value";

            let processedQuestion = {
              [idKey]: question[isSubQuestion ? "subQuestionId" : "questionId"], // Dynamically assign the correct ID
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
              // @ts-ignore
              processedQuestion.formValues = formValues;
            } else if (question.type === "time") {
              if (
                Array.isArray(question[valueKey]) &&
                question[valueKey].length >= 2
              ) {
                // @ts-ignore
                processedQuestion.firstTimeValues = question[valueKey][0]?.time;
                // @ts-ignore
                processedQuestion.secondTimeValue = question[valueKey][1]?.time;
              }
            } else if (question.type === "checkbox") {
              const checkboxValues = Array.isArray(question[valueKey])
                ? question[valueKey]
                : [question[valueKey]];
              // @ts-ignore
              processedQuestion.checkboxValue = checkboxValues;
            } else if (question.type === "day") {
              const days = Array.isArray(question[valueKey])
                ? question[valueKey].map(({ index, day }) => ({
                    index,
                    day,
                  }))
                : [];
              // @ts-ignore
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
              // @ts-ignore
              processedQuestion.mapValues = mapValues;
            } else {
              // @ts-ignore
              processedQuestion.value = question[valueKey];
            }

            // Process subquestionsValues recursively and pass true for isSubQuestion
            if (
              Array.isArray(question.subquestionsValues) &&
              question.subquestionsValues.length > 0
            ) {
              // @ts-ignore
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

        // Make the API call
        return addUpdateDocumentQuestionApi({
          isDraft,
          values: finalData,
          documentId,
        });
      },
      onError: displayErrorMessage,
    });

  return { isLoading, addUpdateDocumentQuestion };
};
