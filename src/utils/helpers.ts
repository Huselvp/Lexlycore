import { AxiosError } from "axios";

interface ErrorResponseData {
  message?: string;
}

interface CustomError extends Error {
  response?: {
    data?: string | ErrorResponseData;
  };
}

import toast from "react-hot-toast";
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK" }).format(
    value
  );

export const displayErrorMessage = (error: AxiosError | CustomError) => {
  let errorMessage: string = "";

  const isErrorResponseData = (data: unknown): data is ErrorResponseData => {
    return typeof data === "object" && data !== null && "message" in data;
  };

  if (typeof error?.response?.data === "string") {
    errorMessage = error.response.data;
  } else if (isErrorResponseData(error?.response?.data)) {
    errorMessage = error.response.data.message || "Something went wrong";
  } else if (error?.message) {
    errorMessage = error.message;
  } else {
    errorMessage = "Something went wrong";
  }

  if (errorMessage === "Access Denied") {
    errorMessage = "Email or password is incorrect";
  }

  toast.error(errorMessage);
};

export const transformParamToNumber = (
  val: string | number | null | undefined
): number => {
  if (val === null || val === undefined || isNaN(Number(val))) {
    return -1;
  }
  return Number(val);
};

export const extractChoicesFromString = (item: string): Choice[] => {
  const arr: string[] = item.split("/");
  const choices: Choice[] = [];
  if (arr.length <= 2) return choices;
  for (let i = 1; i < arr.length; i += 3)
    choices.push({
      id: +arr[i],
      newRelatedText: arr[i + 1],
      choice: arr[i + 2],
    });
  return choices;
};

export const getToken = (): string =>
  localStorage.getItem("access_token") || "";

export const setToken = (token: string): void =>
  localStorage.setItem("access_token", token);
export const removeToken = (): void => localStorage.removeItem("access_token");
