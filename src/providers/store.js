import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { configureStore } from '@reduxjs/toolkit';

import courseReducer from './slices/courseSlice';
import userReducer from './slices/userSlice';

import { sttCourseApi } from './apis/sttCourseApi';
import { courseApi } from './apis/courseApi';
import { courseTeacherApi } from './apis/courseTeacherApi';
import { userApi } from './apis/userApi';

import { cmtApi } from './apis/cmtApi';
import { noteApi } from './apis/noteApi';
import { lessonApi } from './apis/lessonApi';
import modalReducer from './slices/modalSlice';
import lessonReducer from './slices/lessonSlice';
import { paymentApi } from './apis/paymentApi';
import { chapterApi } from './apis/chapterApi';
import { paymentDetailApi } from './apis/paymentDetail';
import { rateApi } from './apis/rateApi';
import { cateApi } from './apis/cateApi';

export const store = configureStore({
    reducer: {
        course: courseReducer,
        user: userReducer,
        modal: modalReducer,
        lesson: lessonReducer,
        [chapterApi.reducerPath]: chapterApi.reducer,
        [courseApi.reducerPath]: courseApi.reducer,
        [courseTeacherApi.reducerPath]: courseTeacherApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [cmtApi.reducerPath]: cmtApi.reducer,
        [sttCourseApi.reducerPath]: sttCourseApi.reducer,
        [noteApi.reducerPath]: noteApi.reducer,
        [lessonApi.reducerPath]: lessonApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [paymentDetailApi.reducerPath]: paymentDetailApi.reducer,
        [rateApi.reducerPath]: rateApi.reducer,
        [cateApi.reducerPath]: cateApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            courseApi.middleware,
            courseTeacherApi.middleware,
            userApi.middleware,
            sttCourseApi.middleware,
            cmtApi.middleware,
            noteApi.middleware,
            lessonApi.middleware,
            paymentApi.middleware,
            paymentDetailApi.middleware,
            chapterApi.middleware,
            rateApi.middleware,
            cateApi.middleware,
        ),
});

setupListeners(store.dispatch);
