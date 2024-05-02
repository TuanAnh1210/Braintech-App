import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const paymentDetailApi = createApi({
    reducerPath: 'paymentDetailApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/paymentDetail' }),
    endpoints: (build) => ({
        getAllPayment: build.query({
            query: () => `/getall`,
        }),
    }),
});

export const { useGetAllPaymentQuery } = paymentDetailApi;
