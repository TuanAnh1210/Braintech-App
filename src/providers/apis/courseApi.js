import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie'; // Import the Cookies object from react-cookie

const cookies = new Cookies(); // Create a new instance of Cookies

export const courseApi = createApi({
    reducerPath: 'courseApi',
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
        getCourses: build.query({
            query: () => {
                return 'api/courses/all/client';
            },
        }),
        getDetail: build.query({
            query: (courseId) => {
                return `api/courses/${courseId}`;
            },
        }),
        getCourseLearning: build.query({
            query: (courseId) => {
                return `api/courses/${courseId}/learning`;
            },
        }),
    }),
});

export const { useGetCoursesQuery, useGetCourseLearningQuery, useGetDetailQuery } = courseApi;
