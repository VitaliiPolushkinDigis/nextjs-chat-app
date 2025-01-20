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
    Authorization: `Bearer ${getAccessToken()}`,
  },
};

function getAccessToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("access_token")
    : null;
}

// Function to get the refresh token from cookies (optional for refreshing)
function getRefreshToken() {
  return typeof window !== "undefined"
    ? localStorage.getItem("refresh_token")
    : null;
}
const instance = axios.create({
  baseURL: API_URL,
  ...config,
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// TODO: Response interceptor (handle token refresh logic)
instance.interceptors.response.use(
  (response) => response, // Return the response if there's no error
  async (error) => {
    // TODO: Handle token refresh
    return Promise.reject(error);
  }
);

/* instance.interceptors.response.use(
  (response) => response, // Return the response if no error
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 error (Unauthorized) and the request hasn't been retried yet
    if (
      typeof window !== "undefined" &&
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Set a flag to prevent infinite loops

      // Check if the refresh token is available
      const refreshToken = getRefreshToken(); // Retrieve from storage or cookies
      if (!refreshToken) {
        // If no refresh token, prevent retry and handle it as an unauthenticated error
        console.error("No refresh token available, please log in.");
        // You can redirect to the login page or show an error message to the user
        return Promise.reject(error);
      }

      // Refresh the access token
      try {
        const newAccessToken = await useApi.refreshToken();
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        // Handle failed token refresh logic here (e.g., logout, show message)
        return Promise.reject(refreshError);
      }
    }

    // If not a token expiration error, throw the error as is
    return Promise.reject(error);
  }
); */

export const useApi = {
  async register(dto: CreateUserParams) {
    const { data } = await instance.post(`/auth/register`, dto);
    return data;
  },
  async login(dto: UserCredentialsParams) {
    const { data } = await instance.post(`/auth/login`, dto);

    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);

    return data;
  },
  async status() {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token")
          : null;

      if (!token) return;

      const { data } = await instance.get(`/auth/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    } catch (error) {
      console.log("error", error);
      // throw new Error(`${error}`);
      return;
    }
  },
  async logout() {
    const res = await instance.post(`/auth/logout`);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    return res;
  },
  async refreshToken() {
    try {
      const refreshToken = getRefreshToken();
      const { data } = await instance.post(`/auth/refresh-token`, {
        refresh_token: refreshToken,
      });

      // Store the new access token in localStorage
      localStorage.setItem("access_token", data.access_token);
      return data.access_token;
    } catch (error) {
      console.error("Refresh token error", error);
      throw new Error("Failed to refresh token");
    }
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
      const token = getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        console.log("Did not passed Authorization Bearer");
      }
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
      const token = getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        console.log("Did not passed Authorization Bearer");
      }
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
      const token = getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        console.log("Did not passed Authorization Bearer");
      }
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
      const token = getAccessToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        console.log("Did not passed Authorization Bearer");
      }
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
