import { createSlice } from '@reduxjs/toolkit';

const user = JSON.parse(localStorage.getItem('access_token'));

const initialState = user;

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        login: (state, action) => {
            return { ...state, ...action.payload };
        },
        logout: () => {
            localStorage.removeItem('access_token');
            return null;
        },
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
