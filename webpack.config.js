// webpack.config.js
import Dotenv from 'dotenv-webpack';

export const plugins = [
    new Dotenv({
        path: '/.env', // default is .env
    }),
];
