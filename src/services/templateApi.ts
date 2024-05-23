import axios from "axios"
import {
  getApiConfig,
  createTemplateUrl,
  deleteTemplateUrl,
  getTemplateUrl,
  getTemplatesURL,
  updateTemplateUrl
} from "../utils/constants"

export const getTemplates = async (): Promise<Template[]> => {
  const res = await axios.get(getTemplatesURL, getApiConfig())
  console.log("Res template = ", res)
  
  return res.data
}

export const getTemplate = async (id: number): Promise<Template> => {
  const res = await axios.get(getTemplateUrl(id), getApiConfig())
  console.log("Res = ", res)
  if (!res.data || typeof res.data !== "object") throw new Error("")
  return res.data
}

export const addTemplate = async (
  data: Pick<
    Template,
    "templateName" | "templateDescription" | "cost" | "content"
  >
) => {
  if (!data.templateName.trim()) throw new Error("Template name is required")
  if (!data.templateDescription.trim())
    throw new Error("Template description is required")
  if (!data.cost) throw new Error("Template cost is required")
  if (!data.content.trim()) throw new Error("Template content is required")

  await axios.post(createTemplateUrl(), data, getApiConfig())
}

export const updateTemplate = (data: Template) => {
  if (!data.templateName.trim()) throw new Error("Template name is required")
  if (!data.templateDescription.trim())
    throw new Error("Template description is required")
  if (!data.cost) throw new Error("Template cost is required")
  if (!data.content.trim()) throw new Error("Template content is required")
  return axios.put(updateTemplateUrl(data.id), data, getApiConfig())
}

export const deleteTemplate = (id: number) =>
  axios.delete(deleteTemplateUrl(id), getApiConfig())
