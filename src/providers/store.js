import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { configureStore } from '@reduxjs/toolkit';

import courseReducer from './slices/courseSlice';
import userReducer from './slices/userSlice';

import { sttCourseApi } from './apis/sttCourseApi';
import { courseApi } from './apis/courseApi';
import { userApi } from './apis/userApi';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { sttCourseApi } from './apis/sttCourseApi';
import { cmtApi } from './apis/cmtApi';

export const store = configureStore({
    reducer: {
        course: courseReducer,
        user: userReducer,
        [courseApi.reducerPath]: courseApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [sttCourseApi.reducerPath]: sttCourseApi.reducer,
        [cmtApi.reducerPath]: cmtApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            courseApi.middleware,
            userApi.middleware,
            sttCourseApi.middleware,
            cmtApi.middleware,
        ),
});

setupListeners(store.dispatch);
