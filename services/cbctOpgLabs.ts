// src/redux/services/cbctOpgLabsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CbctOpgLab } from "@/types/cbctOpgLab";

// ✅ Helper to get token (only client-side)
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/cbct-opg-labs`;

const prepareHeaders = (headers: Headers) => {
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers; // ⚡ Don't force Content-Type (important for FormData)
};

export const cbctOpgLabsApi = createApi({
  reducerPath: "cbctOpgLabsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  }),
  tagTypes: ["CbctOpgLabs"],
  endpoints: (builder) => ({
    // ✅ GET all labs
    getCbctOpgLabs: builder.query<CbctOpgLab[], void>({
      query: () => `/`,
      providesTags: ["CbctOpgLabs"],
      transformResponse: (response: { success: boolean; data: CbctOpgLab[] }) =>
        response.data,
    }),

    // ✅ GET single lab by ID
    getCbctOpgLabById: builder.query<CbctOpgLab, string>({
      query: (id) => `/${id}`,
      providesTags: ["CbctOpgLabs"],
    }),

    // ✅ CREATE new lab (with FormData)
    addCbctOpgLab: builder.mutation<CbctOpgLab, FormData>({
      query: (formData) => ({
        url: `/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["CbctOpgLabs"],
    }),

    // ✅ UPDATE lab
    updateCbctOpgLab: builder.mutation<
      CbctOpgLab,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => {
        const token = getToken();
        const headers = new Headers();
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return {
          url: `/${id}`,
          method: "PUT",
          body: formData,
          headers,
        };
      },
      invalidatesTags: ["CbctOpgLabs"],
    }),

    // ✅ DELETE lab
    deleteCbctOpgLab: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CbctOpgLabs"],
    }),
  }),
});

// ✅ Export auto-generated hooks
export const {
  useGetCbctOpgLabsQuery,
  useGetCbctOpgLabByIdQuery,
  useAddCbctOpgLabMutation,
  useUpdateCbctOpgLabMutation,
  useDeleteCbctOpgLabMutation,
} = cbctOpgLabsApi;
