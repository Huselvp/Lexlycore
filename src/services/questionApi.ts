import axios from "axios";
import {
  getApiConfig,
  createQuestionUrl,
  deleteQuestionUrl,
  getQuestionUrl,
  updateQuestionUrl,
  API,
} from "../utils/constants";

const handleFilterValueType = async (
  questionId,
  questionText,
  description,
  descriptionDetails,
  texte,
  valueType
) => {
  try {
    await axios.post(
      `${API}/filter/add-question/${questionId}`,
      {
        questionText,
        description,
        descriptionDetails,
        texte,
        valueType,
      },
      getApiConfig()
    );
  } catch (err) {
    console.log(err);
  }
};

// export const addQuestion = async ({
//   question,
//   templateId,
// }: {
//   question: Pick<
//     Question,
//     | "questionText"
//     | "description"
//     | "descriptionDetails"
//     | "texte"
//     | "valueType"
//   >;
//   templateId: number;
// }): Promise<Question> => {
//   if (!question.questionText.trim())
//     throw new Error("Question text is required");
//   if (!question.description.trim())
//     throw new Error("Question description is required");
//   if (!question.descriptionDetails.trim())
//     throw new Error("Question details is required");
//   if (!question.texte.trim()) throw new Error("Question content is required");
//   if (!question.valueType.trim()) throw new Error("Question type is required");
//   const res = await axios.post(
//     createQuestionUrl(templateId),
//     question,
//     getApiConfig()
//   );
//   console.log("Res = ", res);
//   console.log("Data = ", res.data);
//   return res.data;
// };

export const addQuestion = async ({
  question,
  templateId,
}: {
  question: Pick<
    Question,
    | "questionText"
    | "description"
    | "descriptionDetails"
    | "texte"
    | "valueType"
  >;
  templateId: number;
}): Promise<Question> => {
  if (!question.questionText.trim())
    throw new Error("Question text is required");
  if (!question.description.trim())
    throw new Error("Question description is required");
  if (!question.descriptionDetails.trim())
    throw new Error("Question details is required");
  if (!question.texte.trim()) throw new Error("Question content is required");
  if (!question.valueType.trim()) throw new Error("Question type is required");

  // Call the additional function if valueType is 'filter'
  if (question.valueType === "filter") {
    handleFilterValueType(
      question.id,
      question.questionText,
      question.description,
      question.descriptionDetails,
      question.texte,
      question.valueType
    );
  }

  const res = await axios.post(
    createQuestionUrl(templateId),
    question,
    getApiConfig()
  );
  console.log("Res = ", res);
  console.log("Data = ", res.data);
  return res.data;
};

export const deleteQuestion = async (id: number): Promise<void> =>
  axios.delete(deleteQuestionUrl(id), getApiConfig());

export const updateQuestion = async (question: Question): Promise<void> => {
  if (!question.questionText.trim())
    throw new Error("Question text is required");
  if (!question.description.trim())
    throw new Error("Question description is required");
  if (!question.descriptionDetails.trim())
    throw new Error("Question details is required");
  if (!question.texte.trim()) throw new Error("Question content is required");
  if (!question.valueType.trim()) throw new Error("Question type is required");
  axios.put(updateQuestionUrl(question.id), question, getApiConfig());
};

export const getQuestion = async (id: number): Promise<Question> => {
  const res = await axios.get(getQuestionUrl(id), getApiConfig());
  console.log("question request reponse ", res);
  return res.data;
};
