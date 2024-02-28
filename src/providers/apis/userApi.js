import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_URL_API }),
    endpoints: (build) => ({
        getUsers: build.query({
            query: () => '/user',
        }),
        login: build.mutation({
            query: (payload) => {
                return { url: '/user/login', method: 'POST', body: payload };
            },
        }),
        register: build.mutation({
            query: (payload) => {
                return { url: '/user/register', method: 'POST', body: payload };
            },
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGetUsersQuery } = userApi;
