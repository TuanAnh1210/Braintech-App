import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    nextLesson: '',
};

const lessonSlice = createSlice({
    name: 'lesson',
    initialState,
    reducers: {
        addNextLesson: (state, action) => {
            state.nextLesson = action.payload;
        },
    },
});

export const { addNextLesson } = lessonSlice.actions;
const lessonReducer = lessonSlice.reducer;

export default lessonReducer;
