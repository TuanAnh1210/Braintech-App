import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { configureStore } from '@reduxjs/toolkit';

import courseReducer from './slices/courseSlice';
import userReducer from './slices/userSlice';

import { sttCourseApi } from './apis/sttCourseApi';
import { courseApi } from './apis/courseApi';
import { userApi } from './apis/userApi';

import { cmtApi } from './apis/cmtApi';
import { noteApi } from './apis/noteApi';
import { lessonApi } from './apis/lessonApi';
import modalReducer from './slices/modalSlice';

export const store = configureStore({
    reducer: {
        course: courseReducer,
        user: userReducer,
        modal: modalReducer,
        [courseApi.reducerPath]: courseApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [sttCourseApi.reducerPath]: sttCourseApi.reducer,
        [cmtApi.reducerPath]: cmtApi.reducer,
        [noteApi.reducerPath]: noteApi.reducer,
        [lessonApi.reducerPath]: lessonApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            courseApi.middleware,
            userApi.middleware,
            sttCourseApi.middleware,
            cmtApi.middleware,
            noteApi.middleware,
            lessonApi.middleware,
        ),
});

setupListeners(store.dispatch);
