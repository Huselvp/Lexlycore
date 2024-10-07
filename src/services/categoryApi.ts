import axios from "axios"
import {
  getApiConfig,
  assignCategoryUrl,
  createCategoryUrl,
  deleteCategoryUrl,
  getCategoriesUrl,
  getCategoryUrl,
  updateCategoryUrl,
  updateTemplateCategoryUrl
} from "../utils/constants"

export const getCategories = async (): Promise<Category[]> => {
  const res = await axios.get(getCategoriesUrl, getApiConfig())
  
  if (!res.data) new Error("Something went wrong")
  return res.data
}
export const addCategory = async (
  category: Omit<Category, "id">
): Promise<Category> => {
  if (!category.name.trim()) throw new Error("Category name is required")
  if (!category.categoryType) throw new Error("Category type is required")
  return axios.post(createCategoryUrl, category, getApiConfig())
}

export const updateCategory = async (category: Category): Promise<void> => {
  if (!category.name.trim()) throw new Error("Category name is required")
  if (!category.categoryType) throw new Error("Category type is required")
  return axios.put(updateCategoryUrl(category.id), category, getApiConfig())
}

export const deleteCategory = async (id: number): Promise<void> =>
  axios.delete(deleteCategoryUrl(id), getApiConfig())

export const getCategory = (id: number) =>
  axios.get(getCategoryUrl(id), getApiConfig())

export const assignUpdateCategory = async ({
  onAssign,
  categoryId,
  templateId
}: {
  categoryId: number
  templateId: number
  onAssign: boolean
}): Promise<Category> => {
  const res = await axios[`${onAssign ? "post" : "put"}`](
    onAssign
      ? assignCategoryUrl({
          categoryId,
          templateId
        })
      : updateTemplateCategoryUrl({ categoryId, templateId }),
    {},
    getApiConfig()
  )
  
  if (!res.data?.data) throw new Error("Something went wrong")
  console.log(res.data?.data)
  return res.data?.data
}
