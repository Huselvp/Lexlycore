import toast from "react-hot-toast";
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK" }).format(
    value
  );
export const displayErrorMessage = (error: any) => {
  console.log("********************************");
  console.log("Error = ", error);
  let errorMessage: string =
    (typeof error?.response?.data === "string" && error?.response?.data) ||
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong";
  if (errorMessage === "Access Denied")
    errorMessage = "Email or password is incorrect";
  console.log("Error Message = ", errorMessage);
  console.log("********************************");
  toast.error(errorMessage);
};
export const transformParamToNumber = (val: any) => {
  if (isNaN(val)) return -1;
  return +val;
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
