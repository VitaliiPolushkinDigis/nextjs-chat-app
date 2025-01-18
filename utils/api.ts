import axios, { AxiosRequestConfig } from "axios";
import {
  ConversationType,
  CreateMessageParams,
  CreateUserParams,
  FetchMessagePayload,
  Profile,
  User,
  UserCredentialsParams,
  UserSearchParams,
  UserWithoutPassword,
} from "./types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_URL =
  /* "http://localhost:3001/api" */ "https://test-nest-api-production.up.railway.app/api"; /* process.env.NEXT_PUBLIC_REACT_APP_API_URL */
const config: AxiosRequestConfig = {
  withCredentials: true,
  headers: {
    "Access-Control-Allow-Origin":
      /* "http://localhost:3001/api" */ "https://test-nest-api-production.up.railway.app/api",
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
    try {
      console.log("--------called useApi.status");

      const { data } = await instance.get(`/auth/status`);
      return data;
    } catch (error) {
      console.log("error", error);
      throw new Error(`${error}`);
    }
  },
  async logout() {
    const res = await instance.post(`/auth/logout`);
  },
};

//use instance instead of directly axios
export const postRegisterUser = async (data: CreateUserParams) =>
  instance.post(`${API_URL}/auth/register`, data, config);

export const postLoginUser = async (data: UserCredentialsParams) =>
  instance.post(`${API_URL}/auth/login`, data, config);

export const getAuthUser = (cookies: any) =>
  instance.get<User>(`${API_URL}/auth/status`, {
    ...config,
    headers: { ...config.headers, Cookie: cookies },
  });

export const getConversations = () =>
  instance.get<ConversationType[]>(`${API_URL}/conversations`, config);

export const getConversationMessages = (id: number) =>
  instance.get<FetchMessagePayload>(`${API_URL}/messages/${id}`, config);

export const postNewMessage = (data: CreateMessageParams) => {
  instance.post(`${API_URL}/messages`, data, config);
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

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}`,
    prepareHeaders(headers) {
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    getProfilePosts: builder.query<any[], number>({
      query: (id: number) => `posts/profile/${id}`,
      providesTags: ["Posts"],
    }),
    createPost: builder.mutation<{ title: string }, any>({
      query: (data: any) => ({
        url: `posts`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Posts"],
    }),
  }),
});

export const profilesApi = createApi({
  reducerPath: "profilesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}`,
    prepareHeaders(headers) {
      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getProfiles: builder.query<any, any>({
      query: () => `profiles`,
    }),
    getProfile: builder.query<Profile, any>({
      query: (profileId: number) => `profiles/${profileId}`,
    }),
  }),
});

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}`,
    prepareHeaders(headers) {
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<UserWithoutPassword[], void>({
      query: () => `users`,
    }),
    getUser: builder.query<UserWithoutPassword[], number>({
      query: (id: number) => `users/${id}`,
    }),
    getUsersWithoutConversations: builder.query<
      UserWithoutPassword[],
      UserSearchParams
    >({
      query: (params: UserSearchParams) =>
        `users/search?withoutConversationWithMe=${params.withoutConversationWithMe}`,
    }),
    findUsersWithConversationsBadge: builder.query<UserWithoutPassword[], void>(
      {
        query: () => `users/hasConversationsBadge`,
      }
    ),
  }),
});

export const conversationsApi = createApi({
  reducerPath: "conversationsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}`,
    prepareHeaders(headers) {
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Conversations"],
  endpoints: (builder) => ({
    postConversation: builder.mutation<
      any,
      { recipientId: number; message: string }
    >({
      query: (data: any) => ({
        url: `conversations`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Conversations"],
    }),
  }),
});

export const {
  useGetProfilesQuery,
  useGetProfileQuery,
  useLazyGetProfileQuery,
} = profilesApi;

export const {
  useGetProfilePostsQuery,
  useCreatePostMutation,
  useLazyGetProfilePostsQuery,
} = postsApi;

export const { usePostConversationMutation } = conversationsApi;

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useGetUsersWithoutConversationsQuery,
  useFindUsersWithConversationsBadgeQuery,
} = usersApi;
