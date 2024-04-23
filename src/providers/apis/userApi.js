import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api' }),
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
        forgetPassword: build.mutation({
            query: (payload) => {
                return { url: `/user/forgetPassword/${payload._id}`, method: 'PATCH', body: payload };
            },
        }),

    }),
});

export const { useLoginMutation, useRegisterMutation, useGetUsersQuery, useForgetPasswordMutation } = userApi;
