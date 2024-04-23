
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cmtApi = createApi({
    reducerPath: 'cmtApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api' }),
    endpoints: (build) => ({
        getAll: build.query({
            query: (lesson_id) => `/comments/lesson/${lesson_id}`,
        }),
        createCmt: build.mutation({
            query: (payload) => {
                return { url: `/comments`, method: 'POST', body: payload };
            },
        }),
        deleteCmt: build.mutation({
            query: (id) => {
                return { url: `/comments/delete/${id}`, method: 'DELETE' };
            },
        }),
        updateCmt: build.mutation({
            query: (payload) => {
                return { url: `/comments/${payload.id}`, method: 'PATCH', body: payload };
            },
        }),
    }),
});

export const { useGetAllQuery, useCreateCmtMutation, useDeleteCmtMutation, useUpdateCmtMutation } = cmtApi;
