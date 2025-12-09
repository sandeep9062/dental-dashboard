import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ✅ Helper to get token (client-side only)
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/plans`;

const prepareHeaders = (headers: Headers) => {
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

// ✅ TypeScript interfaces
export interface Pricing {
  monthly: number;
  yearly: number;
  discountPercentage?: number;
}

export interface Plan {
  _id: string;
  type: string;
  name: string;
  pricing: Pricing;
  duration: string;
  features: string[];
  highlight: boolean;
  description?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const plansApi = createApi({
  reducerPath: "plansApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  }),
  tagTypes: ["Plans", "Plan"],
  endpoints: (builder) => ({
    // ✅ GET all plans
    getPlans: builder.query<Plan[], void>({
      query: () => `/`,
      providesTags: ["Plans"],
      transformResponse: (response: Plan[]) => response,
    }),

    // ✅ GET single plan by ID
    getPlanById: builder.query<Plan, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Plan", id }],
      transformResponse: (response: Plan) => response,
    }),

    // ✅ CREATE new plan
    addPlan: builder.mutation<Plan, Partial<Plan>>({
      query: (data) => ({
        url: `/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Plans"],
    }),

    // ✅ UPDATE plan
    updatePlan: builder.mutation<Plan, { id: string; data: Partial<Plan> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Plans",
        { type: "Plan", id },
      ],
    }),

    // ✅ DELETE plan
    deletePlan: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        "Plans",
        { type: "Plan", id },
      ],
    }),
  }),
});

// ✅ Export hooks for usage in components
export const {
  useGetPlansQuery,
  useGetPlanByIdQuery,
  useAddPlanMutation,
  useUpdatePlanMutation,
  useDeletePlanMutation,
} = plansApi;
