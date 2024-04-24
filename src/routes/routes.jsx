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
import Register from '@/pages/Client/Register';

import UserManager from '@/pages/Admin/UserManager';
import CourseList from '@/pages/Admin/CoursesList';
import Quizz from '@/pages/Client/Quizz';
import Certificate from '@/pages/Client/Certificate';
import ForgotPassword from '@/pages/Client/Forgetpassword';
import Account from '@/pages/Client/Account';

const publicRoutes = [
    { path: config.home, component: Home },
    { path: config.courses, component: Courses },
    { path: config.login, component: Login, layout: null },
    { path: config.register, component: Register, layout: null },
    { path: config.forgetPassword, component: ForgotPassword, layout: null },
    { path: config.learning, component: Learning, layout: null },
    { path: config.certificate, component: Certificate },
    { path: config.quizz, component: Quizz },
    { path: config.about, component: About },
    { path: config.detail, component: DetailCourse },
    { path: config.contact, component: Contact },
    { path: config.info, component: Info },
    { path: config.account, component: Account },
];

const privateRoutes = [
    { path: 'dashboard', component: UserManager },
    { path: 'manager-users', component: UserManager },
    { path: 'manager-courses', component: CourseList },
    { path: 'manager-comments', component: UserManager },
    { path: 'manager-bills', component: UserManager },
    { path: 'statistical', component: UserManager },
];

export { publicRoutes, privateRoutes };
