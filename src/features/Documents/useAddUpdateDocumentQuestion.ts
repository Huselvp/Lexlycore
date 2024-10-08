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
        values: unknown;
      }) => {
        const processQuestions = (questions : any, isSubQuestion = false) => {
          return questions.map((question : any) => {
            const idKey = isSubQuestion ? "subQuestionId" : "questionId";
            const valueKey = "value";

            const processedQuestion = {
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
              const mapString = question[valueKey] || "";
              const mapParts = mapString.split(",").map((part : any) => part.trim());

              const mapValues = mapParts.reduce((acc : any, value : any, index : any) => {
                acc[index + 1] = value;
                return acc;
              }, {});

              processedQuestion.mapValues = mapValues;
            } else {
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

        const orderMyData = (data : any) => {
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
