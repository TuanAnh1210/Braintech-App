import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie'; // Import the Cookies object from react-cookie

const cookies = new Cookies(); // Create a new instance of Cookies

export const sttCourseApi = createApi({
    reducerPath: 'sttCourseApi',
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
        getSttCourse: build.query({
            query: () => '/api/sttCourse',
        }),
        addSttCourse: build.mutation({
            query: (payload) => {
                return { url: 'api/sttCourse/add', method: 'POST', body: payload };
            },
        }),
        countCourseUser: build.query({
            query: (id) => `api/sttCourse/count/${id}`,
        }),
        getAllSttCourse: build.query({
            query: () => `api/sttCourse/getall`,
        }),
        updateSttCourse: build.mutation({
            query: (payload) => {
                return { url: 'api/sttCourse/updatesttCourse', method: 'PUT', body: payload };
            },
        }),
    }),
});

export const {
    useAddSttCourseMutation,
    useUpdateSttCourseMutation,
    useGetSttCourseQuery,
    useCountCourseUserQuery,
    useGetAllSttCourseQuery,
} = sttCourseApi;
