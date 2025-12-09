// src/redux/services/blogsApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ✅ Helper to get token (only client-side)
const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/blogs`;

const prepareHeaders = (headers: Headers) => {
  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
};

interface Comment {
  name: string;
  email: string;
  comment: string;
  createdAt: string;
}

interface Blog {
  _id: string;
  title: string;
  slug: string; // ✅ Added slug to Blog interface
  desc: string;
  content: string;
  image?: string;
  category: string;
  tags: string[];
  author: string;
  authorImage?: string;
  date: string;
  readTime: number;
  views: number;
  likes: number;
  isFeatured: boolean;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  status: "draft" | "published" | "archived";
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export const blogsApi = createApi({
  reducerPath: "blogsApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders,
  }),
  tagTypes: ["Blogs", "Blog", "Comments"],
  endpoints: (builder) => ({
    // ✅ GET all blogs
    getBlogs: builder.query<Blog[], void>({
      query: () => `/`,
      providesTags: ["Blogs"],
      transformResponse: (response: { blogs: Blog[] }) => response.blogs,
    }),

    // ✅ GET single blog by ID
    getBlogById: builder.query<Blog, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Blog", id }],
      transformResponse: (response: { blog: Blog }) => response.blog,
    }),

    // ✅ GET single blog by slug
    getBlogBySlug: builder.query<Blog, string>({
      query: (slug) => `/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Blog", id: slug }],
      transformResponse: (response: { blog: Blog }) => response.blog,
    }),

    // ✅ CREATE new blog (now includes slug)
    addBlog: builder.mutation<Blog, FormData>({
      query: (formData) => ({
        url: `/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blogs"],
    }),

    // ✅ UPDATE blog (now includes slug)
    updateBlog: builder.mutation<Blog, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => ["Blogs", { type: "Blog", id }],
    }),

    // ✅ DELETE blog
    deleteBlog: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => ["Blogs", { type: "Blog", id }],
    }),

    // ✅ ADD Comment
    addComment: builder.mutation<
      Comment[],
      { id: string; data: { name: string; email: string; comment: string } }
    >({
      query: ({ id, data }) => ({
        url: `/${id}/comments`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Blogs", { type: "Blog", id }],
      transformResponse: (response: { comments: Comment[] }) => response.comments,
    }),
  }),
});

// ✅ Export hooks
export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useGetBlogBySlugQuery,
  useAddBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useAddCommentMutation,
} = blogsApi;
