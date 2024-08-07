import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { transformParamToNumber } from "../../../utils/helpers";
import { getSubQuestion } from "../../../services/subquestionapi";

export const useSubQuestion = () => {
  const params = useParams();
  const subquestionId = transformParamToNumber(params.subquestionId);
  const questionId = transformParamToNumber(params.questionId);
  const {
    isError,
    isPending: isLoading,
    data: question,
  } = useQuery({
    queryKey: ["subquestion", subquestionId],
    queryFn: () => getSubQuestion(questionId, subquestionId),
  });

  return { isError, isLoading, question };
};
