const routes = {
    home: '/',
    courses: '/courses',
    about: '/about',
    contact: '/contact',
    detail: '/detail/teacher/:courseId',
    detailCourseTeacher: '/detail/teacher/:courseId',
    learning: '/learning/:courseId/:lessonId',
    learningTeacher: '/learning/teacher/:courseId/:lessonId',
    login: '/login',
    register: '/register',
    forgetPassword: '/forgetPassword',
    info: '/info',
    quizz: '/quizz/:id',
    certificate: '/certificate/:id',
    account: '/account',
    chat: '/chat',
    notify: '/notify',
};

export default routes;
