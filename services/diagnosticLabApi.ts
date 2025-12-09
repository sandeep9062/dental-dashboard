import { api } from "../lib/api";
import { DiagnosticLab } from "../types/diagnosticLab";

export const diagnosticLabApi = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getDiagnosticLabs: builder.query<DiagnosticLab[], void>({
      query: () => "/v1/diagnostic-labs",
      transformResponse: (response: { data: DiagnosticLab[] }) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "DiagnosticLab" as const, id: _id })),
              { type: "DiagnosticLab", id: "LIST" },
            ]
          : [{ type: "DiagnosticLab", id: "LIST" }],
    }),
    addDiagnosticLab: builder.mutation<DiagnosticLab, Partial<DiagnosticLab>>({
      query: (body) => ({
        url: "/v1/diagnostic-labs",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "DiagnosticLab", id: "LIST" }],
    }),
    updateDiagnosticLab: builder.mutation<DiagnosticLab, { id: string; body: Partial<DiagnosticLab> }>({
      query: ({ id, body }) => ({
        url: `/v1/diagnostic-labs/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "DiagnosticLab", id }],
    }),
    deleteDiagnosticLab: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/v1/diagnostic-labs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "DiagnosticLab", id }],
    }),
  }),
});

export const {
  useGetDiagnosticLabsQuery,
  useAddDiagnosticLabMutation,
  useUpdateDiagnosticLabMutation,
  useDeleteDiagnosticLabMutation,
} = diagnosticLabApi;
