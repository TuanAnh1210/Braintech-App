import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie';
const cookies = new Cookies(); // Create a new instance of Cookies

export const paymentDetailApi = createApi({
    reducerPath: 'paymentDetailApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_REACT_APP_API_PATH + 'api/paymentDetail',
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
        getAllPayment: build.query({
            query: () => `/getall`,
        }),
        getAllPaymentByUser: build.query({
            query: () => `/getbyuserid`,
        }),
    }),
});

export const { useGetAllPaymentQuery, useGetAllPaymentByUserQuery } = paymentDetailApi;
