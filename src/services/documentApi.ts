import axios from "axios";
import {
  addDocumentQuestionUrl,
  addUpdateDocumentQuestionUrl,
  createDocumentUrl,
  deleteDocumentUrl,
  generateDocumentUrl,
  getApiConfig,
  getDocumentQuestionsValuesUrl,
  getDocumentsUrl,
} from "../utils/constants";
import { getToken } from "../utils/helpers";

export const getDocments = async (): Promise<DocumentUser[]> => {
  const res = await axios.get(getDocumentsUrl(), getApiConfig());
  // return res.data
  // const documents = await axios.get(getDocumentsUrl(), getApiConfig())
  return res.data;
};

export const createDocument = async (templateId: number) => {
  const res = await axios.post(
    createDocumentUrl(templateId),
    {},
    getApiConfig()
  );
  const documentId = res.data?.documentId;
  if (!documentId) throw new Error("");
  return { templateId, documentId };
};

export const addUpdateDocumentQuestion = async (
  data: AddUpdateDocumentQuestion
) => {
  const res = await axios.post(
    addUpdateDocumentQuestionUrl,
    data,
    getApiConfig()
  );
  console.log("Res = ", res.data);
  if (!res.data.success) throw new Error("Something went wrong");
};

export const addValuesToDocuments = async (data: AddUpdateDocumentQuestion) => {
  const res = await axios.post(addDocumentQuestionUrl, data, getApiConfig());
  console.log("res = ", res);
};

export const generateDocument = async ({
  documentId,
  templateId,
  templateName,
}: {
  documentId: number;
  templateId: number;
  templateName: string;
}) => {
  const token = getToken();
  const response = await axios.get(
    generateDocumentUrl({ documentId, templateId }),
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      responseType: "blob", // Important for handling binary data
      withCredentials: true,
    }
  );
  console.log("Res = ", response);
  // Create a blob from the response data
  const blob = new Blob([response.data], { type: "application/pdf" });

  // Create a URL for the blob
  const url = URL.createObjectURL(blob);

  // Create an anchor element to trigger the download
  const link = document.createElement("a");
  link.href = url;
  link.download = `${templateName}-document.pdf`;
  document.body.appendChild(link);

  // Trigger the download
  link.click();

  // Remove the anchor element
  document.body.removeChild(link);

  // Revoke the URL to free up resources
  URL.revokeObjectURL(url);
};

export const deleteDocument = async (documentId: number) =>
  axios.delete(deleteDocumentUrl(documentId), getApiConfig());

export const getDocumentQuestionsValues = async ({
  documentId,
}: {
  documentId: number;
}): Promise<DocumentQuestionsValues> => {
  const res = await axios.get(
    getDocumentQuestionsValuesUrl(documentId),
    getApiConfig()
  );
  return res.data;
};
