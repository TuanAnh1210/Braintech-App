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
        getAllCourseFinish: build.query({
            query: (id) => `/sttCourse/finishCourse/${id}`,
        }),
        getAllCourseJoin: build.query({
            query: (id) => `/sttCourse/joinedCourse/${id}`,
        }),
    }),
});

export const {
    useAddSttCourseMutation,
    useGetSttCourseQuery,
    useCountCourseUserQuery,
    useGetAllCourseFinishQuery,
    useGetAllCourseJoinQuery,
} = sttCourseApi;
