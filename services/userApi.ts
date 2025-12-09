import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ✅ Helper to get token (only client-side)
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`;

const prepareHeaders = (headers: Headers) => {
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

// ✅ Interfaces
export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role:
    | "patient"
    | "admin"
    | "dentist"
    | "pharma&brand"
    | "cbct&opgcenters"
    | "diagnosticlabs";
  isActive: boolean;
  googleId?: string;
  profile?: Record<string, any>;
  resetPasswordToken?: string;
  resetPasswordExpire?: string;
  createdAt: string;
}

interface UpdateUserPayload {
  id: string;
  data: Partial<User>;
}

interface ToggleUserStatusPayload {
  id: string;
  isActive: boolean;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  }),
  tagTypes: ["Users", "User"],

  endpoints: (builder) => ({
    // ✅ Get all users
    getUsers: builder.query<User[], void>({
      query: () => ``,
      providesTags: ["Users"],
    }),

    // ✅ Get single user by ID
    getUserById: builder.query<User, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
      transformResponse: (response: { user: User }) => response.user,
    }),

    // ✅ Create a new user
    addUser: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: `/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    // ✅ Update user
    updateUser: builder.mutation<User, UpdateUserPayload>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Users", { type: "User", id }],
    }),

    // ✅ Delete user
    deleteUser: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => ["Users", { type: "User", id }],
    }),

    // ✅ Toggle active/inactive status
    toggleUserStatus: builder.mutation<User, ToggleUserStatusPayload>({
      query: ({ id, isActive }) => ({
        url: `/${id}/toggle`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => ["Users", { type: "User", id }],
    }),

    // ✅ Filter users by role
    getUsersByRole: builder.query<User[], string>({
      query: (role) => `/role/${role}`,
      providesTags: ["Users"],
      transformResponse: (response: { users: User[] }) => response.users,
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  useGetUsersByRoleQuery,
} = userApi;
