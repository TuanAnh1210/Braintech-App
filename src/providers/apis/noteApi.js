import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { Cookies } from 'react-cookie'; // Import the Cookies object from react-cookie

const cookies = new Cookies(); // Create a new instance of Cookies

export const noteApi = createApi({
    reducerPath: 'noteApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
        prepareHeaders: (headers) => {
            const token = cookies.get('cookieLoginStudent'); // Lấy giá trị token từ cookie

            // If we have a token set in state, let's assume that we should be passing it.
            if (token) {
                headers.set('Authorization', `Bearer ${token.accessToken}`);
            }

            return headers;
        },
    }),
    endpoints: (build) => ({
        getNoteByLessonId: build.query({
            query: (lessonId) => `/notes/${lessonId}`,
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

export const { useGetNoteByLessonIdQuery, useCreateNoteMutation, useDeleteNoteMutation, useUpdateNoteMutation } =
    noteApi;
