import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const sttCourseApi = createApi({
    reducerPath: 'sttCourseApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_URL_API }),
    endpoints: (build) => ({
        getSttCourse: build.query({
            query: () => '/sttCourse',
        }),

        addSttCourse: build.mutation({
            query: (payload) => {
                return { url: '/sttCourse/add', method: 'POST', body: payload };
            },
        }),
    }),
});

export const { useAddSttCourseMutation, useGetSttCourseQuery } = sttCourseApi;
