// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   displayErrorMessage,
//   transformParamToNumber,
// } from "../../../utils/helpers";
// import { addEditChoice as addEditChoiceApi } from "../../../pages/admin/addChoicetoSubQuestionSecondVersion/subChoiceApi";
// import { useParams } from "react-router-dom";

// export const useAddEditSubChoice = () => {
//   const params = useParams();
//   const questionId = transformParamToNumber(params.questionId);
//   const queryClient = useQueryClient();
//   const { isPending: isLoading, mutate: addEditChoice } = useMutation({
//     mutationFn: ({ onAdd, choice }: { onAdd: boolean; choice: Choice }) =>
//       addEditChoiceApi({ questionId, choice, onAdd }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["question", questionId] });
//     },
//     onError: displayErrorMessage,
//   });
//   return { isLoading, addEditChoice };
// };

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  displayErrorMessage,
  transformParamToNumber,
} from "../../../utils/helpers";
import { addEditChoice as addEditChoiceApi } from "../../../pages/admin/addChoicetoSubQuestionSecondVersion/subChoiceApi";
import { useParams } from "react-router-dom";

export const useAddEditSubChoice = () => {
  const params = useParams();
  const questionId = transformParamToNumber(params.questionId);
  const subquestionId = transformParamToNumber(params.subquestionId); // Added subquestionId
  const queryClient = useQueryClient();

  const { isPending: isLoading, mutate: addEditChoice } = useMutation({
    mutationFn: ({ onAdd, choice }: { onAdd: boolean; choice: Choice }) =>
      addEditChoiceApi({ questionId, subquestionId, choice, onAdd }), // Added subquestionId
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question", questionId] });
    },
    onError: displayErrorMessage,
  });

  return { isLoading, addEditChoice };
};