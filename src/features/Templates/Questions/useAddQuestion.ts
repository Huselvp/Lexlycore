import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addQuestion as addQuestionApi } from "../../../services/questionApi";
import { displayErrorMessage } from "../../../utils/helpers";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

export const useAddQuestion = () => {
  const params = useParams();
  const templateId = Number(params.templateId) ?? -1;
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { isPending: isLoading, mutate: addQuestion } = useMutation({
    mutationFn: (
      question: Pick<
        Question,
        | "questionText"
        | "description"
        | "descriptionDetails"
        | "texte"
        | "valueType"
      >
    ) => addQuestionApi({ templateId, question }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["template", templateId] });
      toast.success("Question added successfully");
      navigate(-1);
    },
    onError: displayErrorMessage,
  });
  return { isLoading, addQuestion };
};
