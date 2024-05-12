import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie';
const cookies = new Cookies();
export const userApi = createApi({
    reducerPath: 'userApi',
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
        getUsers: build.query({
            query: () => 'api/user',
        }),
        login: build.mutation({
            query: (payload) => {
                return { url: 'api/user/login', method: 'POST', body: payload };
            },
        }),
        register: build.mutation({
            query: (payload) => {
                return { url: 'api/user/register', method: 'POST', body: payload };
            },
        }),
        forgetPassword: build.mutation({
            query: (payload) => {
                return { url: `api/user/forgetPassword/${payload._id}`, method: 'PUT', body: payload };
            },
        }),
        updateProfile: build.mutation({
            query: (payload) => {
                return { url: `api/user/update`, method: 'PATCH', body: payload };
            },
        }),
        getUserById: build.query({
            query: () => {
                return `api/user/get`;
            },
            transformResponse: (response) => {
                return response.data;
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetUsersQuery,
    useGetUserByIdQuery,
    useForgetPasswordMutation,
    useUpdateProfileMutation,
} = userApi;
