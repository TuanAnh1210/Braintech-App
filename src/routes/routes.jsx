import config from '@/config/routes';

// Pages
import Courses from '@/pages/Courses';
import Home from '@/pages/Home';
import Login from '@/pages/Login';

const publicRoutes = [
    { path: config.home, component: Home },
    { path: config.courses, component: Courses },
    { path: config.login, component: Login },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
