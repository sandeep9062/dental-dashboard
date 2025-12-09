import { api } from "../lib/api";
import { SupportRequest } from "@/types/support";

export const supportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSupports: builder.query<SupportRequest[], void>({
      query: () => "/v1/support",
      providesTags: ["Support"],
    }),
    updateSupportStatus: builder.mutation<
      void,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/v1/support/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Support"],
    }),
    deleteSupport: builder.mutation<void, string>({
      query: (id) => ({
        url: `/v1/support/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Support"],
    }),
  }),
});

export const {
  useGetSupportsQuery,
  useUpdateSupportStatusMutation,
  useDeleteSupportMutation,
} = supportApi;
