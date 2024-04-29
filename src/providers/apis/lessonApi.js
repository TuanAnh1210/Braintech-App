import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const lessonApi = createApi({
    reducerPath: 'lessonApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api' }),
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
    useAddFinishLessonMutation,
    useGetNextLessonQuery,
} = lessonApi;
