import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Helper to get token from localStorage
const getToken = () => localStorage.getItem("token");

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/website-images`;
const prepareHeaders = (headers: Headers) => {
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  // Don't set Content-Type here; let the browser handle it for FormData
  return headers;
};

// Interface for the image data structure from the API
interface WebsiteImage {
  _id: string;
  publicId: string;
  url: string;
  altText?: string;
  context?: string;
  filename?: string;
  belongsTo?: {
    resourceType: string;
    resourceId: string;
  };
  pageUrl?: string;
  width?: number;
  height?: number;
  order?: number;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Interface for the API response
interface ApiResponse {
  success: boolean;
  data: WebsiteImage[];
}

// Interface for single image API response
interface SingleImageApiResponse {
  success: boolean;
  data: WebsiteImage;
}

// Interface for delete API response
interface DeleteApiResponse {
  success: boolean;
  message: string;
}

export const websiteImagesApi = createApi({
  reducerPath: "websiteImagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  }),
  tagTypes: ["WebsiteImages"],
  endpoints: (builder) => ({
    // GET all website images
    getWebsiteImages: builder.query<ApiResponse, void>({
      query: () => `/`,
      providesTags: ["WebsiteImages"],
    }),

    // GET single website image by ID
    getWebsiteImageById: builder.query<SingleImageApiResponse, string>({
      query: (id) => `/${id}`,
      providesTags: ["WebsiteImages"],
    }),

    // POST new website image
    addWebsiteImage: builder.mutation<SingleImageApiResponse, FormData>({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["WebsiteImages"],
    }),

    // UPDATE website image
    updateWebsiteImage: builder.mutation<
      SingleImageApiResponse,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["WebsiteImages"],
    }),

    // DELETE website image
    deleteWebsiteImage: builder.mutation<DeleteApiResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["WebsiteImages"],
    }),
  }),
});

// Export hooks
export const {
  useGetWebsiteImagesQuery,
  useGetWebsiteImageByIdQuery,
  useAddWebsiteImageMutation,
  useUpdateWebsiteImageMutation,
  useDeleteWebsiteImageMutation,
} = websiteImagesApi;
