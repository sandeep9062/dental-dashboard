import { Enquiry } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/popup-form`;

export const popUpFormApi = createApi({
  reducerPath: "popUpFormApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
  }),
  tagTypes: ["PopUpForm"],
  endpoints: (builder) => ({
    getPopUpForms: builder.query<Enquiry[], void>({
      query: () => ``,
      providesTags: ["PopUpForm"],
    }),
    addPopUpForm: builder.mutation<void, FormData>({
      query: (body) => ({
        url: ``,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PopUpForm"],
    }),
    deletePopUpForm: builder.mutation<void, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PopUpForm"],
    }),
  }),
});

export const {
  useGetPopUpFormsQuery,
  useAddPopUpFormMutation,
  useDeletePopUpFormMutation,
} = popUpFormApi;
