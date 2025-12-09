// src/redux/services/clinicApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Clinic } from "../types/clinic";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/clinics`;

const prepareHeaders = (headers: Headers) => {
  // Safely get token from localStorage
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  return headers;
};

export const clinicApi = createApi({
  reducerPath: "clinicApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  }),
  tagTypes: ["Clinics"],
  endpoints: (builder) => ({
    // ✅ GET all clinics
    getClinics: builder.query<Clinic[], void>({
      query: () => `/`,
      providesTags: ["Clinics"],
      transformResponse: (response: { success: boolean, data: Clinic[] }) => response.data,
    }),

    // ✅ GET single clinic
    getClinicById: builder.query<Clinic, string>({
      query: (id) => `/${id}`,
      providesTags: ["Clinics"],
    }),

    // ✅ CREATE clinic (with logo/icon upload via FormData)
    addClinic: builder.mutation<Clinic, FormData>({
      query: (formData) => ({
        url: `/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Clinics"],
    }),

    // ✅ UPDATE clinic
    updateClinic: builder.mutation<
    Clinic,
    { id: string; formData: FormData | Partial<Clinic> }
  >({
    query: ({ id, formData }) => ({
      url: `/${id}`,
      method: "PUT",
      body: formData,
    }),
    invalidatesTags: ["Clinics"],
  }),

    // ✅ DELETE clinic
    deleteClinic: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clinics"],
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetClinicsQuery,
  useGetClinicByIdQuery,
  useAddClinicMutation,
  useUpdateClinicMutation,
  useDeleteClinicMutation,
} = clinicApi;
