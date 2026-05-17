import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Task {
  id: string;
  title: string;
  content?: string;
  favorite: boolean;
  state: boolean;
  order: number;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  startDate?: string;
  timeSpent: number;
  hourlyRate?: number;
  columnId?: string;
  projectId: string;
  userId:string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  projectId: string;
  tasks?: Task[];
}

export interface Project {
  id: string;
  title: string;
  type: string;
  order: number;
  columns?: Column[];
}

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/projects' }),
  tagTypes: ['Task', 'Column', 'Project'],
  endpoints: (builder) => ({
    // Project endpoints
    getProjects: builder.query<Project[], void>({
      query: () => '/project',
      providesTags: ['Project'],
    }),
    createProject: builder.mutation<Project, Partial<Project>>({
      query: (project) => ({
        url: '/project',
        method: 'POST',
        body: project,
      }),
      invalidatesTags: ['Project'],
    }),
    
    // Column endpoints
    getColumns: builder.query<Column[], string>({
      query: (projectId) => `/columns?projectId=${projectId}`,
      providesTags: ['Column' ],
    }),
    createColumn: builder.mutation<Column, Partial<Column>>({
      query: (column) => ({
        url: '/columns',
        method: 'POST',
        body: column,
      }),
      invalidatesTags: ['Column'],
    }),
    updateColumn: builder.mutation<Column, Partial<Column>>({
      query: ({ id, ...patch }) => ({
        url: `/columns/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Column'],
    }),
    deleteColumn: builder.mutation<void, string>({
      query: (id) => ({
        url: `/columns/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Column'],
    }),
    
    // Task endpoints
    getTasks: builder.query<Task[], string>({
      query: (columnId) => `/tasks?columnId=${columnId}`,
      providesTags: ['Task'],
    }),
    createTask: builder.mutation<Task, Partial<Task>>({
      query: (task) => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Task','Column','Project'],
    }),
    updateTask: builder.mutation<Task, Partial<Task>>({
      query: ({ id, ...patch }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Task','Column','Project'],
      
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task','Column','Project'],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetColumnsQuery,
  useCreateColumnMutation,
  useUpdateColumnMutation,
  useDeleteColumnMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = todoApi;