import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie'; // Import the Cookies object from react-cookie

const cookies = new Cookies(); // Create a new instance of Cookies

export const cmtApi = createApi({
    reducerPath: 'cmtApi',
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
        getAll: build.query({
            query: (lesson_id) => `api/comments/lesson/${lesson_id}`,
            transformResponse: (response) => {
                return response.data;
            },
        }),
        createCmt: build.mutation({
            query: (payload) => {
                return { url: `api/comments`, method: 'POST', body: payload };
            },
        }),
        deleteCmt: build.mutation({
            query: (id) => {
                return { url: `api/comments/delete/${id}`, method: 'DELETE' };
            },
        }),
        updateCmt: build.mutation({
            query: (payload) => {
                return { url: `api/comments/${payload.id}`, method: 'PATCH', body: payload };
            },
        }),
    }),
});

export const { useGetAllQuery, useCreateCmtMutation, useDeleteCmtMutation, useUpdateCmtMutation } = cmtApi;
