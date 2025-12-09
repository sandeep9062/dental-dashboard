import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

export interface FinancialData {
  _id: string;
  month: string;
  year: number;
  revenue: {
    subscriptionFees: number;
    commissionFromClinics: number;
    advertisementRevenue: number;
    total: number;
  };
  expenses: {
    marketing: number;
    salaries: number;
    techCost: number;
    operations: number;
    total: number;
  };
  profit: number;
  createdAt: string;
  updatedAt: string;
}

export const financialRTKApi = createApi({
  reducerPath: "financialRTKApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/financial`,
    prepareHeaders: (headers) => {
      const token = getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllFinancialData: builder.query<FinancialData[], void>({
      query: () => "/", // Corresponds to GET /api/v1/financial
    }),
  }),
});

export const { useGetAllFinancialDataQuery } = financialRTKApi;
