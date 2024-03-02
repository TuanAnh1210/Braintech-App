import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cmtApi = createApi({
    reducerPath: 'cmtApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api' }),
    endpoints: (build) => ({
        getAll: build.query({
            query: (lesson_id) => `/comments/${lesson_id}`,
        }),
        createCmt: build.mutation({
            query: (payload) => {
                return { url: `/comments`, method: 'POST', body: payload };
            },
        }),
    }),
});

export const { useGetAllQuery, useCreateCmtMutation } = cmtApi;
