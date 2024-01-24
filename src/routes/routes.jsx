import config from '@/config/routes';
import Dashboard from '@/pages/Admin/Dashboard';
import About from '@/pages/Client/About';
import Contact from '@/pages/Client/Contact';

// Pages
import Courses from '@/pages/Client/Courses';
import DetailCourse from '@/pages/Client/DetailCourse';
import Home from '@/pages/Client/Home';
import Info from '@/pages/Client/Info';
import Learning from '@/pages/Client/Learning';
import Login from '@/pages/Client/Login';

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
const RoutesAdmin = [
    { path: config.admin_dashboard, component: Dashboard },
];

export { publicRoutes, privateRoutes, RoutesAdmin };
