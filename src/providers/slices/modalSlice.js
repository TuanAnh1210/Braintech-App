import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
    page: 'login',
};

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        openModal: (state, action) => {
            state.isOpen = true;
            state.page = action.payload;
        },
        closeModal: (state, action) => {
            state.isOpen = false;
        },
    },
});

export const { openModal, closeModal } = modalSlice.actions;
const modalReducer = modalSlice.reducer;

export default modalReducer;
