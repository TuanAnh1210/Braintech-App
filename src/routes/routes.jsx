import config from '@/config/routes';
import About from '@/pages/About';
import Contact from '@/pages/Contact';

// Pages
import Courses from '@/pages/Courses';
import DetailCourse from '@/pages/DetailCourse';
import Home from '@/pages/Home';
import Info from '@/pages/Info';
import Learning from '@/pages/Learning';
import Login from '@/pages/Login';

const publicRoutes = [
    { path: config.home, component: Home },
    { path: config.courses, component: Courses },
    { path: config.login, component: Login, layout: null },
    { path: config.learning, component: Learning, layout: null },
    { path: config.about, component: About },
    { path: config.detail, component: DetailCourse },
    { path: config.contact, component: Contact },
    { path: config.info, component: Info },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
