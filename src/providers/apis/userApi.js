import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

// Tạo một middleware custom để thêm thông tin authorization vào mỗi request
const authMiddleware = (baseQuery) => async (args, api, extraOptions) => {
    // Lấy token từ local storage hoặc bất kỳ nguồn nào khác

    const token = Cookies.get('access_token');

    // Nếu tồn tại token, thêm thông tin authorization vào header của request
    if (token) {
        if (!args.headers) {
            args.headers = {};
        }
        args.headers['Authorization'] = `Bearer ${token}`;
    }

    // Gọi fetchBaseQuery để thực hiện request với thông tin authorization được thêm vào
    return baseQuery(args, api, extraOptions);
};

export const userApi = createApi({
    reducerPath: 'userApi',
    baseQuery: authMiddleware(fetchBaseQuery({ baseUrl: import.meta.env.VITE_REACT_APP_API_PATH })),
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
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetUsersQuery,
    useForgetPasswordMutation,
    useUpdateProfileMutation,
} = userApi;
