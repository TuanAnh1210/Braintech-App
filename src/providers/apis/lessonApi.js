import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie'; // Import the Cookies object from react-cookie

const cookies = new Cookies(); // Create a new instance of Cookies

export const lessonApi = createApi({
    reducerPath: 'lessonApi',
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
        getLesson: build.query({
            query: () => {
                return '/lessons';
            },
        }),
        getLessonById: build.query({
            query: (id) => {
                return `/lessons/${id}`;
            },
            transformResponse: (response) => {
                return response.data;
            },
        }),
        getNextLesson: build.query({
            query: () => {
                return '/lessons/nextLesson';
            },
        }),
        getFinishLesson: build.query({
            query: (id) => {
                return `/finishLesson/${id}`;
            },
        }),
        getFinishLessonByCourseId: build.query({
            query: (courseId) => {
                return `/finishLesson/${courseId}`;
            },
        }),
        getCount: build.query({
            query: (course_id) => {
                return `/finishLesson/count/${course_id}`;
            },
        }),
        addFinishLesson: build.mutation({
            query: (payload) => {
                return { url: '/finishLesson/add', method: 'POST', body: payload };
            },
        }),
    }),
});

export const {
    useGetLessonByIdQuery,
    useGetLessonQuery,
    useGetCountQuery,
    useGetFinishLessonQuery,
    useGetFinishLessonByCourseIdQuery,
    useAddFinishLessonMutation,
    useGetNextLessonQuery,
} = lessonApi;
