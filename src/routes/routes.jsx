import config from '@/config/routes';
import About from '@/pages/Client/About';
import Contact from '@/pages/Client/Contact';

// Pages
import Courses from '@/pages/Client/Courses';
import DetailCourse from '@/pages/Client/DetailCourse';
import Home from '@/pages/Client/Home';
import Info from '@/pages/Client/Info';
import Learning from '@/pages/Client/Learning';
import Login from '@/pages/Client/Login';

import UserManager from '@/pages/Admin/UserManager';

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

const privateRoutes = [
    { path: 'dashboard', component: UserManager },
    { path: 'manager-users', component: UserManager },
    { path: 'manager-courses', component: UserManager },
    { path: 'manager-comments', component: UserManager },
    { path: 'manager-bills', component: UserManager },
    { path: 'statistical', component: UserManager },
];

export { publicRoutes, privateRoutes };
