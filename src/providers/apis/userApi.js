import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api' }),
    endpoints: (build) => ({
        getUsers: build.query({
            query: () => '/users',
        }),

        authUser: build.mutation({
            query: (payload) => {
                console.log(payload);
                return { url: '/users/auth', method: 'POST', body: payload };
            },
        }),
    }),
});

export const { useAuthUserMutation, useGetUsersQuery } = userApi;
