import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie'; // Import the Cookies object from react-cookie

const cookies = new Cookies(); // Create a new instance of Cookies

export const courseApi = createApi({
    reducerPath: 'courseApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8080/api',
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
        getCourses: build.query({
            query: () => {
                return '/courses/all';
            },
        }),
        getDetail: build.query({
            query: (courseId) => {
                return `/courses/${courseId}`;
            },
        }),
        getCourseLearning: build.query({
            query: (courseId) => {
                return `/courses/${courseId}/learning`;
            },
        }),
    }),
});

export const { useGetCoursesQuery, useGetCourseLearningQuery, useGetDetailQuery } = courseApi;
