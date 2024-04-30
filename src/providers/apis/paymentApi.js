import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie'; // Import the Cookies object from react-cookie

const cookies = new Cookies(); // Create a new instance of Cookies

// Tạo một middleware custom để thêm thông tin authorization vào mỗi request
const authMiddleware = (baseQuery) => async (args, api, extraOptions) => {
    // Lấy token từ local storage hoặc bất kỳ nguồn nào khác
    const token = cookies.get('cookieLoginStudent'); // Lấy giá trị token từ cookie

    // Nếu tồn tại token, thêm thông tin authorization vào header của request
    if (token) {
        if (!args.headers) {
            args.headers = {};
        }
        args.headers['Authorization'] = `Bearer ${token.accessToken}`;
    }
    console.log(args, 'args');
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
        handleCheckPayment: build.mutation({
            query: (payload) => {
                return { url: `/create_payment_url`, method: 'POST', body: payload };
            },
        }),
    }),
});

export const { useCreatePaymentUrlMutation } = paymentApi;
