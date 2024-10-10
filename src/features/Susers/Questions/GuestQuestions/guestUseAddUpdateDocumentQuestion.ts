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
            const idKey = "questionId";
            const valueKey = "value";

            let processedQuestion = {
              [idKey]: question[isSubQuestion ? "subQuestionId" : "questionId"],
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
              const mapString = question[valueKey] || "";
              const mapParts = mapString.split(",").map((part) => part.trim());

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

        const finalData = orderMyData(values);

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
