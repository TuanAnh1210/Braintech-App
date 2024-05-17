import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie';
const cookies = new Cookies(); // Create a new instance of Cookies

export const rateApi = createApi({
    reducerPath: 'rateApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_REACT_APP_API_PATH + 'api/rate',
        prepareHeaders: (headers) => {
            const token = cookies.get('cookieLoginStudent'); // Lấy giá trị token từ cookie

            if (token) {
                headers.set('Authorization', `Bearer ${token.accessToken}`);
            }

            return headers;
        },
    }),

    endpoints: (build) => ({
        getContentRating: build.query({
            query: (id) => {
                return `/getallrate/${id}`;
            },
        }),
        rateCourse: build.mutation({
            query: (payload) => {
                return { url: '/ratecourse', method: 'POST', body: payload };
            },
        }),
    }),
});
export const { useGetContentRatingQuery, useRateCourseMutation } = rateApi;
