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

        addFinishLesson: build.mutation({
            query: (payload) => {
                return { url: '/finishLesson/add', method: 'POST', body: payload };
            },
        }),
    }),
});

export const { useGetLessonQuery, useGetFinishLessonQuery, useAddFinishLessonMutation, useGetNextLessonQuery } =
    lessonApi;
