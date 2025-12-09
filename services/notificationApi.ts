import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ✅ Helper to get token (only client-side)
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications`;

const prepareHeaders = (headers: Headers) => {
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  }),
  tagTypes: ["Notifications"],
  endpoints: (builder) => ({
    // ✅ GET all notifications
    getNotifications: builder.query<any[], void>({
      query: () => ``,
      providesTags: ["Notifications"],
    }),
  }),
});

// ✅ Export hooks
export const { useGetNotificationsQuery } = notificationApi;
