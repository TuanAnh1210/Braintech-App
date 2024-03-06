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
    }),
});

export const { useGetLessonQuery } = lessonApi;
