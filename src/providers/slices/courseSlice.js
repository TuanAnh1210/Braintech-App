import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    courseId: '',
};

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {},
});

const courseReducer = courseSlice.reducer;

export default courseReducer;
