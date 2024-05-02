import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const sttCourseApi = createApi({
    reducerPath: 'sttCourseApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api' }),
    endpoints: (build) => ({
        getSttCourse: build.query({
            query: () => '/sttCourse',
        }),
        addSttCourse: build.mutation({
            query: (payload) => {
                return { url: '/sttCourse/add', method: 'POST', body: payload };
            },
        }),
        countCourseUser: build.query({
            query: (id) => `/sttCourse/count/${id}`,
        }),
        getAllSttCourse: build.query({
            query: (id) => `/sttCourse/getall`,
        }),
    }),
});

export const { useAddSttCourseMutation, useGetSttCourseQuery, useCountCourseUserQuery, useGetAllSttCourseQuery } =
    sttCourseApi;
