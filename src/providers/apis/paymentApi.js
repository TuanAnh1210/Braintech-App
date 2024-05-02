import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie'; // Import the Cookies object from react-cookie

const cookies = new Cookies(); // Create a new instance of Cookies

export const paymentApi = createApi({
    reducerPath: 'paymentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api/payment',
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

export const { useCreatePaymentUrlMutation, useGetAllByUserIdQuery } = paymentApi;
