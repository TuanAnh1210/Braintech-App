import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import authMiddleware from '@/core/authMiddleware';

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
