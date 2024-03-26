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
            return { ...state, isOpen: true, ...action.payload };
        },
        closeModal: (state, action) => {
            return { ...state, isOpen: false };
        },
    },
});

export const { openModal, closeModal } = modalSlice.actions;
const modalReducer = modalSlice.reducer;

export default modalReducer;
