import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  prepareHeaders: (headers) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Blog",
    "Clinic",
    "Contact",
    "Support",
    "Patient",
    "DiagnosticLab",
    "WebsiteImage",
    "SiteSettings",
    "Dentist",
  ],
  endpoints: () => ({}),
});
