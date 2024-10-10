/* eslint-disable @typescript-eslint/no-unused-vars */
type Category = {
  id: number;
  name: string;
  categoryType: "PRIVATE" | "BUSINESS";
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type DocumentUser = {
  id: number;
  createdAt: Date;
  draft: boolean;
  paymentStatus: boolean;
  template: Template;
};

type Template = {
  id: number;
  templateName: string;
  templateDescription: string;
  cost: number;
  content: string;
  subcategory: Category | null;
  questions: Question[];
};
type Question = {
  position: string | number;
  id: number;
  questionText: string;
  description: string;
  descriptionDetails: string;
  texte: string;
  valueType: "number" | "input" | "textarea" | "checkbox";
};
type Choice = {
  id: number;
  choice: string;
  newRelatedText: string;
};
type RegisterData = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  username: string;
  role: "SUSER";
};
type LoginData = {
  email: string;
  password: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type User = {
  userId: number;
  firstname: string | null;
  username: string | null;
  lastname: string | null;
  phonenumber: string | null;
  description: string | null;
  adress: string | null;
  email: string;
  country: string | null;
  zipcode: number;
  town: string | null;
  picture: string | null;
  role: "SUSER | ADMIN";
};

type questionAnswersType = {
  label: string;
  value: string;
};
type Answer = {
  questionId: number;
  value: string | null;
};

type AddUpdateDocumentQuestion = {
  isDraft: boolean;
  documentId: number;
  values: {
    questionId: number;
    value: string | number;
  }[];
};
type chargePaymentData = {
  paymentId: string;
  templateId: number;
  documentId: number;
};

type DocumentQuestionsValues = {
  documentQuestionValueId: number;
  question: Question;
  value: string | number;
};

type SubQuestion = {
  id: number;
  questionText: string;
  description: string;
  descriptionDetails: string;
  valueType: "number" | "input" | "textarea" | "checkbox";
  textArea: string;
};
