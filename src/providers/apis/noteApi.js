import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

export const noteApi = createApi({
    reducerPath: 'noteApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api' }),
    endpoints: (build) => ({
        getNotebyIdClient: build.query({
            query: (id) => `/notes/${id}`,
        }),
        createNote: build.mutation({
            query: (payload) => {
                return { url: '/notes/', method: 'POST', body: payload };
            },
        }),
        deleteNote: build.mutation({
            query: (id) => {
                return { url: `/notes/delete/${id}`, method: 'DELETE' };
            },
        }),
        updateNote: build.mutation({
            query: (payload) => {
                return { url: `/notes/update/${payload._id}`, method: 'PUT', body: payload };
            },
        }),
    }),
});

export const { useGetNotebyIdClientQuery, useCreateNoteMutation, useDeleteNoteMutation, useUpdateNoteMutation } = noteApi;
