import { Redirect } from 'react-router-dom';
import Cookies from 'js-cookie';
import Courses from '../Courses/';

const withAuth = () => {
    const token = Cookies.get('access_token');

    if (!token) {
        return <Redirect to="/login" />;
    }

    return <Courses />;
};

export default withAuth;
