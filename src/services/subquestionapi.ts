import axios from "axios";
import {
  AddsubQuestionUrl,
  deleteSubQuestionUrl,
  getApiConfig,
  getSubQuestionUrl,
  updateSubQuestionUrl,
} from "../utils/constants";

export const addSubQuestionApi = async ({
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
    AddsubQuestionUrl(questionId),
    subQuestion,
    getApiConfig()
  );

  return res.data;
};

export const deleteSubQuestion = async (
  idq: number,
  idsq: number
): Promise<void> =>
  axios.delete(deleteSubQuestionUrl(idq, idsq), getApiConfig());

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
    updateSubQuestionUrl(question.id, parentQuestionId),
    question,
    getApiConfig()
  );
};

export const getSubQuestion = async (
  idq: number,
  idsq: number
): Promise<SubQuestion> => {
  const res = await axios.get(getSubQuestionUrl(idq, idsq), getApiConfig());
  return res.data;
};
