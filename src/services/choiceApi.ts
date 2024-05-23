import axios from "axios"
import {
  addChoiceUrl,
  getApiConfig,
  deleteChoiceUrl,
  updateChoiceUrl
} from "../utils/constants"

export const addEditChoice = ({
  onAdd,
  questionId,
  choice
}: {
  onAdd: boolean
  questionId: number
  choice: Choice
}): Promise<void> => {
  if (!choice.choice.trim()) throw new Error("Choice is required")
  if (!choice.newRelatedText.trim()) throw new Error("Related text is required")

  return axios[`${onAdd ? "post" : "put"}`](
    onAdd
      ? addChoiceUrl(questionId)
      : updateChoiceUrl({ questionId, choiceId: choice.id }),
    choice,
    getApiConfig()
  )
}
export const deleteChoice = ({
  questionId,
  choiceId
}: {
  questionId: number
  choiceId: number
}) => axios.delete(deleteChoiceUrl({ questionId, choiceId }), getApiConfig())
