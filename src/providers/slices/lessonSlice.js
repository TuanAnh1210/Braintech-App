import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    finishLesson: [],
};

const lessonSlice = createSlice({
    name: 'lesson',
    initialState,
    reducers: {
        add: (state, action) => {
            state.finishLesson.push(action.payload);
        },
    },
});

export const { add } = lessonSlice.actions;
const lessonReducer = lessonSlice.reducer;

export default lessonReducer;
