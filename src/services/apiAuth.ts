import axios from "axios";
import {
  getApiConfig,
  forgotPasswordURL,
  getMeUrl,
  loginURL,
  adminLoginURL,
  registerURL,
  updateEmailUrl,
  resetPasswordUrl,
  updatePersonalDataUrl,
  getUsersUrl,
} from "../utils/constants";
import { removeToken, setToken } from "../utils/helpers";

export const login = async (data: LoginData): Promise<void> => {
  const res = await axios.post(loginURL, data, getApiConfig());
  const { access_token, error_message } = res.data;
  if (error_message) throw new Error(error_message);
  setToken(access_token);
};

export const adminlogin = async (data: LoginData): Promise<void> => {
  const res = await axios.post(adminLoginURL, data, getApiConfig());
  const { access_token, error_message } = res.data;
  if (error_message) throw new Error(error_message);
  setToken(access_token);
};

export const register = async (data: RegisterData): Promise<void> => {
  const res = await axios.post(registerURL, data, getApiConfig());
  const { access_token, error_message } = res.data;
  if (error_message) throw new Error(error_message);
  setToken(access_token);
};

export const getMe = async (): Promise<User | null> => {
  try {
    const res = await axios.get(getMeUrl(), getApiConfig());
    if (!res.data) throw new Error("");
    return res.data;
  } catch {
    return null;
  }
};

export const forgotPassword = (email: string) =>
  axios.post(forgotPasswordURL, { email }, getApiConfig());

export const updateEmail = ({
  email,
  currentPassword,
}: {
  email: string;
  currentPassword: string;
}) => axios.patch(updateEmailUrl(), { email, currentPassword }, getApiConfig());

export const updatePassword = (data: {
  newPassword: string;
  currentPassword: string;
}) => axios.patch(updateEmailUrl(), data, getApiConfig());

export const logout = async () => removeToken();

export const resetPassword = (data: { newPassword: string; token: string }) =>
  axios.post(resetPasswordUrl, data, getApiConfig());

export const updatePersonalData = (data: Partial<User>) =>
  axios.put(updatePersonalDataUrl(), data, getApiConfig());

export const getUsers = async (): Promise<User[]> => {
  const res = await axios.get(getUsersUrl, getApiConfig());
  return res.data;
};
