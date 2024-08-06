import axios from "axios";
import {
  AddSubSubQuestionUrl,
  deleteSubSubQuestionUrl,
  getApiConfig,
  getSubQuestionUrl,
  updateSubSubQuestionUrl,
} from "../../../utils/constants";

export const addSubSubQuestionApi = async ({
  subQuestion,
  questionId,
}: {
  subQuestion: Pick<
    SubQuestion,
    | "questionText"
    | "description"
    | "descriptionDetails"
    | "valueType"
    | "textArea"
  >;
  questionId: number;
}): Promise<SubQuestion> => {
  if (!subQuestion.questionText.trim())
    throw new Error("Question text is required");
  if (!subQuestion.description.trim())
    throw new Error("Question description is required");
  if (!subQuestion.descriptionDetails.trim())
    throw new Error("Question details is required");
  if (!subQuestion.textArea.trim())
    throw new Error("Question content is required");
  if (!subQuestion.valueType.trim())
    throw new Error("Question type is required");
  const res = await axios.post(
    AddSubSubQuestionUrl(questionId),
    subQuestion,
    getApiConfig()
  );
  console.log("Res = ", res);
  console.log("Data = ", res.data);
  return res.data;
};

export const deleteSubQuestion = async (
  idq: number,
  idsq: number
): Promise<void> =>
  axios.delete(deleteSubSubQuestionUrl(idq, idsq), getApiConfig());

export const updateSubQuestion = async (
  question: SubQuestion,
  parentQuestionId: number
): Promise<void> => {
  if (!question.questionText.trim())
    throw new Error("Question text is required");
  if (!question.description.trim())
    throw new Error("Question description is required");
  if (!question.descriptionDetails.trim())
    throw new Error("Question details is required");
  if (!question.textArea.trim())
    throw new Error("Question content is required");
  if (!question.valueType.trim()) throw new Error("Question type is required");
  axios.put(
    updateSubSubQuestionUrl(question.id, parentQuestionId),
    question,
    getApiConfig()
  );
};

// Description
// :
// "test test "
// description_details
// :
// "test test "
// id
// :
// 8
// questionText
// :
// "subquestion 1 "
// text_area
// :
// "<p>test [value]</p>"
// valueType
// :
// "input"

export const getSubQuestion = async (
  idq: number,
  idsq: number
): Promise<SubQuestion> => {
  const res = await axios.get(getSubQuestionUrl(idq, idsq), getApiConfig());
  return res.data;
};
