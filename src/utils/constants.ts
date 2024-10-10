import { getToken } from "./helpers";

export const MaxItemsPerPage = 10;
export const API = import.meta.env.VITE_API;

// Auth
export const registerURL = `${API}/auth/register`;
export const loginURL = `${API}/auth/login`;
export const adminLoginURL = `${API}/auth/login`;
export const forgotPasswordURL = `${API}/auth/forgot-password`;

// Template
export const getTemplatesURL = `${API}/public/all_templates`;
export const getTemplateUrl = (id: number) => `${API}/public/template/${id}`;
export const deleteTemplateUrl = (id: number) =>
  `${API}/admin/delete_template/${id}`;
export const updateTemplateUrl = (id: number) =>
  `${API}/admin/update_template/${id}`;

export const createTemplateUrl = () => {
  const token = getToken();
  return `${API}/admin/create_template/${token}`;
};

export const updateTemplateCategoryUrl = ({
  templateId,
  categoryId,
}: {
  categoryId: number;
  templateId: number;
}) => `${API}/admin/update_category/${templateId}/${categoryId}`;

// Category
export const getCategoryUrl = (id: number) => `${API}/admin/category/${id}`;
export const updateCategoryUrl = (id: number) =>
  `${API}/admin/updateSubcategory/${id}`;
export const getCategoriesUrl = `${API}/public/all_subcategories`;
export const createCategoryUrl = `${API}/admin/addSubCategory`;
export const deleteCategoryUrl = (id: number) =>
  `${API}/admin/DeleteSubcategory/${id}`;
export const assignCategoryUrl = ({
  templateId,
  categoryId,
}: {
  categoryId: number;
  templateId: number;
}) => `${API}/admin/assignSubcategory/${templateId}/${categoryId}`;

//Question
export const createQuestionUrl = (id: number) =>
  `${API}/admin/create_question/${id}`;

export const deleteQuestionUrl = (id: number) =>
  `${API}/admin/delete_question/${id}`;

export const updateQuestionUrl = (id: number) =>
  `${API}/admin/update_question/${id}`;
export const getQuestionUrl = (id: number) => `${API}/admin/question/${id}`;

export const QuestionReorder = () => `${API}/admin/question/reorder`;

// SubQuestion
export const AddsubQuestionUrl = (id: number) =>
  `${API}/admin/questions/subquestions/${id}`;

export const AddSubSubQuestionUrl = (id: number) =>
  `${API}/admin/subquestions/${id}`;

export const deleteSubQuestionUrl = (idq: number, idsq: number) =>
  `${API}/admin/questions/subquestions/${idq}/${idsq}`;

export const deleteSubSubQuestionUrl = (idq: number, idsq: number) =>
  `${API}/admin/subquestions/${idq}/${idsq}`;

export const getSubQuestionUrl = (idq: number, idsq: number) =>
  `${API}/admin/questions/subquestions/${idq}/${idsq}`;

export const updateSubQuestionUrl = (idq: number, idsq: number) =>
  `${API}/admin/questions/subquestions/${idsq}/${idq}`;

export const updateSubSubQuestionUrl = (idq: number, idsq: number) =>
  `${API}/admin/subquestions/${idsq}/${idq}`;

// Choice
export const deleteChoiceUrl = ({
  questionId,
  choiceId,
}: {
  questionId: number;
  choiceId: number;
}) => `${API}/admin/delete-choice/${questionId}/${choiceId}`;

export const deleteSubChoiceUrl = ({
  choiceId,
  subquestionId,
}: {
  choiceId: number;
  subquestionId: number;
}) => `${API}/admin/delete-choice-subquestion/${subquestionId}/${choiceId}`;

export const updateChoiceUrl = ({
  questionId,
  choiceId,
}: {
  questionId: number;
  choiceId: number;
}) => `${API}/admin/update-choice/${questionId}/${choiceId}`;

export const updateSubChoiceUrl = ({
  subquestionId,
  choiceId,
}: {
  choiceId: number;
  subquestionId: number;
}) => `${API}/admin/update-choice-subquestion/${subquestionId}/${choiceId}`;

export const addChoiceUrl = (id: number) =>
  `${API}/admin/add-choice-question/${id}`;

export const addSubChoiceUrl = (subId: number) =>
  `${API}/admin/add-choice-subquestion/${subId}`;

// Auth
export const updateEmailUrl = () => {
  const token = getToken();
  return `${API}/public/updateEMailOrPassword/${token}`;
};

export const getMeUrl = () => {
  const token = getToken();
  return `${API}/public/getMe/${token}`;
};

export const resetPasswordUrl = `${API}/auth/reset`;
export const updatePersonalDataUrl = () => {
  const token = getToken();
  return `${API}/public/update_user/${token}`;
};
export const getUsersUrl = `${API}/admin/all_users`;
// Document


export const getDocumentsUrl = () => {
  const token = getToken();
  return `${API}/suser/get_documents/${token}`;
};

//
export const generateDocumentUrl = ({
  documentId,
  templateId,
}: {
  documentId: number;
  templateId: number;
}) => `${API}/suser/generate-pdf/${documentId}/${templateId}`;


export const createDocumentUrl = (templateId: number) =>
  `${API}/suser/createDocument/${templateId}`;



export const addUpdateDocumentQuestionUrl = `${API}/suser/add-values`;

export const addDocumentQuestionUrl = `${API}/suser/add-values`;

export const initiatePaymentUrl = (templateId: number) =>
  `${API}/suser/initiate-payment/${templateId}`;

export const deleteDocumentUrl = (documentId: number) =>
  `${API}/suser/deleteDocument/${documentId}`;
export const chargePaymentUrl = `${API}/suser/charge-payment`;
//
export const getDocumentQuestionsValuesUrl = (documentId: number) =>
  `${API}/suser/values/${documentId}`;

export const getApiConfig = (includeToken: boolean = true) => {
  if (includeToken) {
    const token = getToken();
    return {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    };
  }
  return {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
};

export const getGuestApiConfig = () => {
  return {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
};

export const questionsAnsewersTypes: questionAnswersType[] = [
  { label: "Number", value: "number" },
  { label: "Short Text", value: "input" },
  { label: "Long Text", value: "textarea" },
  { label: "Multiple Choice", value: "checkbox" },
  { label: "Form", value: "form" },
  { label: "Filter", value: "filter" },
  { label: "Day", value: "day" },
  { label: "Time", value: "time" },
  { label: "Date", value: "date" },
  { label: "Map", value: "map" },
];
