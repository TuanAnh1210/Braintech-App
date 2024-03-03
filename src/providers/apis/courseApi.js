import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const courseApi = createApi({
    reducerPath: 'courseApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_URL_API }),
    endpoints: (build) => ({
        getCourses: build.query({
            query: () => {
                return '/courses/all';
            },
        }),
        getDetail: build.query({
            query: (id) => {
                return `/courses/${id}`;
            },
        }),
    }),
});

export const { useGetCoursesQuery, useGetDetailQuery } = courseApi;
