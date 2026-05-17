import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aiApi = createApi({
  reducerPath: "ai",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/ai",
  }),
  tagTypes: ["Ai"],

  endpoints: (builder) => ({
    getUserTasks: builder.query({
      query: (userId: string) => `/tasks?userId=${userId}`,
      providesTags: ["Ai"],
    }),
  }),
});
export const { useGetUserTasksQuery } = aiApi;
