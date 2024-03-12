import axios, { AxiosRequestConfig } from "axios";
import {
  ConversationType,
  CreateMessageParams,
  CreateUserParams,
  FetchMessagePayload,
  User,
  UserCredentialsParams,
} from "./types";

export const API_URL = "https://chat-nestjs-92c46b4f7e43.herokuapp.com/api";
// "https://chat-nestjs-92c46b4f7e43.herokuapp.com/api"; /* process.env.NEXT_PUBLIC_REACT_APP_API_URL */
const config: AxiosRequestConfig = {
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin":
      "https://chat-nestjs-92c46b4f7e43.herokuapp.com/api" /* "http://localhost:3001/api" */,
    "Content-Type": "application/json",
  },
};

const instance = axios.create({
  baseURL: API_URL,
  ...config,
});

export const useApi = {
  async register(dto: CreateUserParams) {
    const { data } = await instance.post(`/auth/register`, dto);
    return data;
  },
  async login(dto: UserCredentialsParams) {
    const { data } = await instance.post(`/auth/login`, dto);
    return data;
  },
  async status() {
    const { data } = await instance.get(`/auth/status`);

    return data;
  },
};

export const postRegisterUser = async (data: CreateUserParams) =>
  axios.post(`${API_URL}/auth/register`, data, config);

export const postLoginUser = async (data: UserCredentialsParams) =>
  axios.post(`${API_URL}/auth/login`, data, config);

export const getAuthUser = (cookies: any) =>
  axios.get<User>(`${API_URL}/auth/status`, {
    ...config,
    headers: { ...config.headers, Cookie: cookies },
  });

export const getConversations = () =>
  axios.get<ConversationType[]>(`${API_URL}/conversations`, config);

export const getConversationMessages = (id: number) =>
  axios.get<FetchMessagePayload>(`${API_URL}/messages/${id}`, config);

export const postNewMessage = (data: CreateMessageParams) => {
  axios.post(`${API_URL}/messages`, data, config);
};

export const API_AC_TYPES = {
  REQUESTED: "_REQUESTED",
  SUCCESSFUL: "_SUCCESSFUL",
  REJECTED: "_REJECTED",
};

const mock = {
  getConversations,
};

export default mock;
