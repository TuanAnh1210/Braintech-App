import { configureStore } from '@reduxjs/toolkit';
import courseReducer from './slices/courseSlice';
import { courseApi } from './apis/courseApi';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

export const store = configureStore({
    reducer: {
        course: courseReducer,
        [courseApi.reducerPath]: courseApi.reducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(courseApi.middleware),
});

setupListeners(store.dispatch);
