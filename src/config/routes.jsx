const routes = {
    home: '/',
    courses: '/courses',
    about: '/about',
    contact: '/contact',
    detail: '/detail/:courseId',
    // learning: '/learning/:id',
    learning: '/learning/:courseId/:lessonId',
    login: '/login',
    register: '/register',
    forgetPassword: '/forgetPassword',
    info: '/info',
    quizz: '/quizz/:id',
    certificate: '/certificate/:id',
    account: '/account',
};

export default routes;
