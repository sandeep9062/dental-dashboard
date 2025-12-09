import { api } from "../lib/api";
import { PatientProfile } from "@/types/patient";

// 🧠 Define endpoints for patient-related actions
export const patientsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Fetch all patients
    getAllPatients: builder.query<PatientProfile[], void>({
      query: () => "/v1/patients",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({
                type: "Patient" as const,
                id: _id,
              })),
              { type: "Patient", id: "LIST" },
            ]
          : [{ type: "Patient", id: "LIST" }],
    }),

    // ✅ Add new patient
    addPatient: builder.mutation<PatientProfile, FormData>({
      query: (formData) => ({
        url: "/v1/patients",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Patient", id: "LIST" }],
    }),

    // ✅ Update existing patient
    updatePatient: builder.mutation<
      PatientProfile,
      { id: string; data: Partial<PatientProfile> }
    >({
      query: ({ id, data }) => ({
        url: `/v1/patients/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Patient", id }],
    }),

    // ✅ Delete patient
    deletePatient: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/v1/patients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Patient", id: "LIST" }],
    }),

    // ✅ Toggle patient active/inactive
    togglePatientActive: builder.mutation<
      { success: boolean },
      { id: string; isActive: boolean }
    >({
      query: ({ id, isActive }) => ({
        url: `/v1/patients/${id}/toggle`,
        method: "PUT",
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Patient", id }],
    }),
  }),
});

export const {
  useGetAllPatientsQuery,
  useAddPatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useTogglePatientActiveMutation,
} = patientsApi;
