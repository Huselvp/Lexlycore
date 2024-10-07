import { useQuery } from "@tanstack/react-query";
import { getSubQuestion } from "../../../services/subquestionapi";
import { useParams } from "react-router-dom";
import { transformParamToNumber } from "../../../utils/helpers";

export const useSubQuestion = () => {
  const params = useParams();
  const questionId = transformParamToNumber(params.questionId);
  const subQuestionId = transformParamToNumber(params.subquestionId);
  const {
    isError,
    isPending: isLoading,
    data: question,
  } = useQuery({
    queryKey: ["question", questionId],
    queryFn: () => getSubQuestion(questionId, subQuestionId),
  });

  return { isError, isLoading, question };
};
