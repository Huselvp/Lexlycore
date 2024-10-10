import axios from "axios";
import {
  addSubChoiceUrl,
  getApiConfig,
  deleteSubChoiceUrl,
  updateSubChoiceUrl,
} from "../../../utils/constants";

export const addEditChoice = ({
  onAdd,

  subquestionId, // Added subquestionId
  choice,
}: {
  onAdd: boolean;
  questionId: number;
  subquestionId: number; // Added subquestionId
  choice: Choice;
}): Promise<void> => {
  if (!choice.choice.trim()) throw new Error("Choice is required");
  if (!choice.newRelatedText.trim())
    throw new Error("Related text is required");

  return axios[`${onAdd ? "post" : "put"}`](
    onAdd
      ? addSubChoiceUrl(subquestionId) // Updated to use subquestionId
      : updateSubChoiceUrl({ subquestionId, choiceId: choice.id }), // Updated to use subquestionId
    choice,
    getApiConfig()
  );
};

export const deleteChoice = ({
  subquestionId, // Added subquestionId
  choiceId,
}: {
  subquestionId: number; // Added subquestionId
  choiceId: number;
}) =>
  axios.delete(deleteSubChoiceUrl({ subquestionId, choiceId }), getApiConfig()); // Updated to use subquestionId
