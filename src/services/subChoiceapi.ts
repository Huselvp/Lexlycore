import axios from "axios";
import {
  addSubChoiceUrl,
  getApiConfig,
  deleteSubChoiceUrl,
  updateSubChoiceUrl,
} from "../utils/constants";

export const addEditSubChoice = ({
  onAdd,
  subquestionId,
  choice,
}: {
  onAdd: boolean;
  questionId: number;
  subquestionId: number;
  choice: Choice;
}): Promise<void> => {
  if (!choice.choice.trim()) throw new Error("Choice is required");
  if (!choice.newRelatedText.trim())
    throw new Error("Related text is required");

  return axios[`${onAdd ? "post" : "put"}`](
    onAdd
      ? addSubChoiceUrl(subquestionId)
      : updateSubChoiceUrl({ subquestionId, choiceId: choice.id }),
    choice,
    getApiConfig()
  );
};

export const deleteChoice = ({
  subquestionId,
  choiceId,
}: {
  choiceId: number;
  subquestionId: number;
}) =>
  axios.delete(deleteSubChoiceUrl({ subquestionId, choiceId }), getApiConfig());
