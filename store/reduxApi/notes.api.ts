import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const notesApi = createApi({
  reducerPath: "noteApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/projects",
  }),
  tagTypes: ["Notes", "Note"],

  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => "/notes",
      providesTags: ["Notes"],
    }),

    getNote: builder.query({
      query: (id: string) => `/notes/${id}`,
      providesTags: ["Note"],
    }),

    createNote: builder.mutation({
      query: (body) => ({
        url: "/notes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notes"],
    }),

    updateNote: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/notes/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Notes", "Note"],
    }),

    deleteNote: builder.mutation({
      query: (id: string) => ({
        url: `/notes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
  }),
});
export const {
  useCreateNoteMutation,
  useGetNotesQuery,
  useDeleteNoteMutation,
  useGetNoteQuery,
  useUpdateNoteMutation,
} = notesApi;
