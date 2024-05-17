import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cateApi = createApi({
    reducerPath: 'cateApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_REACT_APP_API_PATH + 'api/categories' }),
    endpoints: (build) => ({
        getAllCate: build.query({
            query: () => '/',
        }),
    }),
});

export const { useGetAllCateQuery } = cateApi;
