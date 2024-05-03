import { createSlice } from '@reduxjs/toolkit';
import { Cookies } from 'react-cookie';

// const user = JSON.parse(localStorage.getItem('access_token'));

const cookies = new Cookies(); // Tạo một instance mới của Cookies
const user = cookies.get('cookieLoginStudent'); // Lấy giá trị token từ cookie
const initialState = user ? user : {};

const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        login: (state, action) => {
            return { ...state, ...action.payload };
        },
        logout: () => {
            cookies.remove('cookieLoginStudent');

            return null;
        },
    },
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
