import { api } from '../lib/api';
import { DentistProfile } from '@/types/dentist';

export const dentalApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllDentists: builder.query<DentistProfile[], void>({
      query: () => '/v1/dentists',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Dentist' as const, id: _id })),
              { type: 'Dentist', id: 'LIST' },
            ]
          : [{ type: 'Dentist', id: 'LIST' }],
    }),
    registerDentalPractitioner: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/v1/dental-registrations',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Dentist', id: 'LIST' }],
    }),
    toggleDentistActive: builder.mutation<any, { id: string; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/v1/dentists/${id}/toggle`,
        method: 'PUT',
        body: { isActive },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Dentist', id }],
    }),
    updateDentistProfile: builder.mutation<any, { id: string; data: Partial<DentistProfile> }>({
      query: ({ id, data }) => ({
        url: `/v1/dentists/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Dentist', id }],
    }),
  }),
});

export const {
  useGetAllDentistsQuery,
  useRegisterDentalPractitionerMutation,
  useToggleDentistActiveMutation,
  useUpdateDentistProfileMutation,
} = dentalApi;
