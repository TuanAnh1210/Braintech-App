import { FaUser, FaClapperboard, FaCommentDots, FaRegCreditCard, FaHouseChimney, FaChartPie } from 'react-icons/fa6';

import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './AdminSidebar.module.scss';

const cx = classNames.bind(styles);

function AdminSidebar() {
    const navItem = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <FaHouseChimney className="text-white" /> },
        { path: '/admin/manager-users', label: 'Tài khoản', icon: <FaUser className="text-white" /> },
        { path: '/admin/manager-courses', label: 'Khóa học', icon: <FaClapperboard className="text-white" /> },
        { path: '/admin/manager-comments', label: 'Bình luận', icon: <FaCommentDots className="text-white" /> },
        { path: '/admin/manager-bills', label: 'Hóa đơn', icon: <FaRegCreditCard className="text-white" /> },
        { path: '/admin/statistical', label: 'Thống kê', icon: <FaChartPie className="text-white" /> },
    ];

    return (
        <div
            style={{
                width: '280px',
                position: 'fixed',
                top: 0,
                bottom: 0,
                background: '#111c43',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div
                    className="logo"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottom: '1px solid #b4b4b41a',
                        paddingBottom: '16px',
                        padding: '16px',
                    }}
                >
                    <Link to="/admin/dashboard" className="d-flex align-items-center gap-3">
                        <img
                            width={35}
                            style={{ borderRadius: '5px' }}
                            src="http://localhost/braintech/public/imgs/logo.png"
                            alt=""
                        />
                        <div style={{ fontWeight: 600, fontSize: '20px' }}>
                            <span style={{ color: '#3dd5a2' }}>Brain</span>
                            <span style={{ color: '#6666ff' }}>Tech</span>
                        </div>
                    </Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', padding: '12px', paddingTop: '22px' }}>
                    <div className={cx('nav')}>
                        {navItem.map((item, index) => {
                            return (
                                <NavLink
                                    key={index}
                                    to={item.path}
                                    className={({ isActive }) => cx(isActive ? 'active' : '', 'nav-item')}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </div>
                                </NavLink>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminSidebar;
