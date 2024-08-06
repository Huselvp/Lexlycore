import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { transformParamToNumber } from "../../../utils/helpers";
import { getSubQuestion } from "../../../services/subquestionapi";

export const useSubQuestion = () => {
  const params = useParams();
  const subquestionId = transformParamToNumber(params.subquestionId);
  console.log("test subquestionId ", subquestionId);
  const questionId = transformParamToNumber(params.questionId);
  console.log("test question id ", questionId);
  const {
    isError,
    isPending: isLoading,
    data: question,
  } = useQuery({
    queryKey: ["subquestion", subquestionId],
    queryFn: () => getSubQuestion(questionId, subquestionId),
  });
  console.log("subquestion geted : ", question);
  return { isError, isLoading, question };
};
