import config from '@/config/routes';
import About from '@/pages/About';
import Contact from '@/pages/Contact';

// Pages
import Courses from '@/pages/Courses';
import Home from '@/pages/Home';
import Login from '@/pages/Login';

const publicRoutes = [
    { path: config.home, component: Home },
    { path: config.courses, component: Courses },
    { path: config.login, component: Login, layout: null },
    { path: config.about, component: About },
    { path: config.contact, component: Contact },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
