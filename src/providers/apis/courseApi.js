import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const courseApi = createApi({
    reducerPath: 'courseApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api' }),
    endpoints: (build) => ({
        getCourses: build.query({
            query: () => '/courses',
        }),
    }),
});

export const { useGetCoursesQuery } = courseApi;
