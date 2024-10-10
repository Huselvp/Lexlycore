import { useQuery } from "@tanstack/react-query";
import { getQuestion } from "../../../services/questionApi";
import { useParams } from "react-router-dom";
import { transformParamToNumber } from "../../../utils/helpers";

export const useQuestion = () => {
  const params = useParams();
  const questionId = transformParamToNumber(params.questionId);
  const {
    isError,
    isPending: isLoading,
    data: question,
  } = useQuery({
    queryKey: ["question", questionId],
    queryFn: () => getQuestion(questionId),
  });

  return { isError, isLoading, question };
};
