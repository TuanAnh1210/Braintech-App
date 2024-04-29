import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chapterApi = createApi({
    reducerPath: 'chapterApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080/api/chapters' }),
    endpoints: (build) => ({
        getChapterById: build.query({
            query: (chapterId) => {
                return `/${chapterId}`;
            },
            transformResponse: (response) => {
                return response.data;
            },
        }),
        createChapter: build.mutation({
            query: (payload) => {
                return { url: `/create`, method: 'POST', body: payload };
            },
        }),
        updateChapter: build.mutation({
            query: ({ chapterId, ...payload }) => {
                return { url: `/${chapterId}/update`, method: 'PUT', body: payload };
            },
        }),
    }),
});

export const { useCreateChapterMutation, useUpdateChapterMutation, useGetChapterByIdQuery } = chapterApi;
