/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';

import AdminHeader from '../Components/AdminHeader';
import AdminFooter from '../Components/AdminFooter';
import AdminSidebar from '../Components/AdminSidebar';

import styles from './AdminLayout.module.scss';

const cx = classNames.bind(styles);

const AdminLayout = ({ children }) => {
    return (
        <div className={cx('main')}>
            <AdminSidebar />
            <AdminHeader />
            <div className={cx('main-layout')} style={{ marginLeft: '280px', padding: '0 24px' }}>
                <div className={cx('main-content')}>{children}</div>
                <AdminFooter />
            </div>
        </div>
    );
};

export default AdminLayout;
