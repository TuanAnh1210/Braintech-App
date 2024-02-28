import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { configureStore } from '@reduxjs/toolkit';

import courseReducer from './slices/courseSlice';
import userReducer from './slices/userSlice';

import { sttCourseApi } from './apis/sttCourseApi';
import { courseApi } from './apis/courseApi';
import { userApi } from './apis/userApi';

export const store = configureStore({
    reducer: {
        course: courseReducer,
        user: userReducer,
        [courseApi.reducerPath]: courseApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [sttCourseApi.reducerPath]: sttCourseApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(courseApi.middleware, userApi.middleware, sttCourseApi.middleware),
});

setupListeners(store.dispatch);
