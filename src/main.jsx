import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import GlobalStyles from './components/GlobalStyles/index.js';
import { Provider } from 'react-redux';
import { store } from './providers/store.js';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <GlobalStyles>
            <Provider store={store}>
                <GoogleOAuthProvider clientId="973528131203-6ev1slv3n5f4udef9ene1214jlchb44j.apps.googleusercontent.com">
                    <App />
                </GoogleOAuthProvider>
            </Provider>
        </GlobalStyles>
    </React.StrictMode>,
);
