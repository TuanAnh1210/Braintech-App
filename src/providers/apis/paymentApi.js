import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Tạo một middleware custom để thêm thông tin authorization vào mỗi request
const authMiddleware = (baseQuery) => async (args, api, extraOptions) => {
    // Lấy token từ local storage hoặc bất kỳ nguồn nào khác

    const accessToken = localStorage.getItem('access_token');

    const token = JSON.parse(accessToken || {})?.token;

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

export const paymentApi = createApi({
    reducerPath: 'paymentApi',
    baseQuery: authMiddleware(fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/payment' })),
    endpoints: (build) => ({
        createPaymentUrl: build.mutation({
            query: (payload) => {
                return { url: `/create_payment_url`, method: 'POST', body: payload };
            },
        }),
    }),
});

export const { useCreatePaymentUrlMutation } = paymentApi;
