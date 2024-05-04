import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { Cookies } from 'react-cookie'; // Import the Cookies object from react-cookie

const cookies = new Cookies(); // Create a new instance of Cookies

export const noteApi = createApi({
    reducerPath: 'noteApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_REACT_APP_API_PATH,
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
            query: (lessonId) => `api/notes/${lessonId}`,
            transformResponse: (response) => {
                return response.data;
            },
        }),
        createNote: build.mutation({
            query: (payload) => {
                return { url: 'api/notes', method: 'POST', body: payload };
            },
        }),
        deleteNote: build.mutation({
            query: (id) => {
                return { url: `api/notes/delete/${id}`, method: 'DELETE' };
            },
        }),
        updateNote: build.mutation({
            query: (payload) => {
                return { url: `api/notes/update/${payload._id}`, method: 'PUT', body: payload };
            },
        }),
    }),
});

export const { useGetNoteByLessonIdQuery, useCreateNoteMutation, useDeleteNoteMutation, useUpdateNoteMutation } =
    noteApi;
