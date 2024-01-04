import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './slices/courseSlice';
import { courseApi } from './apis/courseApi';
import { userApi } from './apis/userApi';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { sttCourseApi } from './apis/sttCourseApi';

export const store = configureStore({
    reducer: {
        course: courseReducer,
        [courseApi.reducerPath]: courseApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [sttCourseApi.reducerPath]: sttCourseApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(courseApi.middleware, userApi.middleware, sttCourseApi.middleware),
});

setupListeners(store.dispatch);
