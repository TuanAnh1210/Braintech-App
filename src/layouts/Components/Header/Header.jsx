/* eslint-disable no-unused-vars */
import {
    faBarsStaggered,
    faBell,
    faBook,
    faGear,
    faRightFromBracket,
    faSearch,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { Divider, Tooltip } from 'antd';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '@/providers/slices/modalSlice';

import AuthLayout from '@/layouts/AuthLayout';
import Button from '@/components/Button/Button';
import { logout } from '@/providers/slices/userSlice';

import images from '@/assets/images';
import styles from './Header.module.scss';
import { useCookies } from 'react-cookie';
import Search from '../Search';

const cx = classNames.bind(styles);

const Header = () => {
    const dispatch = useDispatch();
    const handleOpenModal = (page) => {
        dispatch(openModal(page));
    };
    const [cookies, setCookie] = useCookies(['cookieLoginStudent']);
    const naviagte = useNavigate();

    // handle active navbar
    const pathPages = window.location.pathname;
    const arrPaths = pathPages.split('/');
    const [activeNavItem, setActiveNavItem] = useState(arrPaths[arrPaths.length - 1]);

    const [isNavbarOpen, setIsNavbarOpen] = useState(false);

    const handleNavbarToggle = () => {
        setIsNavbarOpen(!isNavbarOpen); // Thay đổi trạng thái của navbar
    };

    const handleNavItemClick = (item) => {
        setActiveNavItem(item);
    };

    const menus = [
        {
            label: 'Tài khoản',
            icon: faUser,
            path: '/account',
        },
        {
            label: 'Khóa học đã mua',
            icon: faBook,
            path: '/account',
        },
        {
            label: 'Thông báo',
            icon: faBell,
            path: '/account',
        },

        {
            label: 'Đăng xuất',
            icon: faRightFromBracket,
            path: null,
            func: () => dispatch(logout()),
        },
    ];

    return (
        <header>
            <Container>
                <div className={cx('wrapper')}>
                    <div className={cx('logo')}>
                        <Link to="/">
                            <img src={images.logo} alt="Braintech" />
                            <p>Brain Tech Edu</p>
                        </Link>
                    </div>

                    <ul className={cx('navbar', { open: isNavbarOpen })}>
                        <li className={cx('close_nav')}>
                            <span className={cx('close_icon')} onClick={handleNavbarToggle}>
                                <FontAwesomeIcon icon={faCircleXmark} />
                            </span>
                        </li>
                        <li
                            data-item=""
                            className={cx('nav_item', { active: activeNavItem === '' })}
                            onClick={() => {
                                handleNavItemClick('');
                            }}
                        >
                            <Button className={cx('nav_link')} to="/">
                                Trang chủ
                            </Button>
                        </li>
                        <li
                            data-item="courses"
                            className={cx('nav_item', { active: activeNavItem === 'courses' })}
                            onClick={() => {
                                handleNavItemClick('courses');
                            }}
                        >
                            <Button className={cx('nav_link')} to="/courses">
                                Khóa học
                            </Button>
                        </li>
                        <li
                            data-item="about"
                            className={cx('nav_item', { active: activeNavItem === 'about' })}
                            onClick={() => {
                                handleNavItemClick('about');
                            }}
                        >
                            <Button className={cx('nav_link')} to="/about">
                                Giới thiệu
                            </Button>
                        </li>
                        <li
                            data-item="contact"
                            className={cx('nav_item', { active: activeNavItem === 'contact' })}
                            onClick={() => {
                                handleNavItemClick('contact');
                            }}
                        >
                            <Button className={cx('nav_link')} to="/contact">
                                Liên hệ
                            </Button>
                        </li>
                    </ul>

                    <div className={cx('actions')}>
                        {cookies.cookieLoginStudent ? (
                            <Tooltip
                                overlayInnerStyle={{
                                    minWidth: '220px',
                                    padding: 0,
                                }}
                                title={
                                    <div className={cx('acc_menu')}>
                                        {menus.map((menu) => {
                                            return (
                                                <div key={menu.label}>
                                                    <div
                                                        onClick={() => (!menu.path ? menu.func() : naviagte(menu.path))}
                                                        className={cx(
                                                            'accMenu_item',
                                                            'd-flex align-items-center gap-2 px-3 py-2',
                                                        )}
                                                        style={{ color: '#000', cursor: 'pointer' }}
                                                    >
                                                        <FontAwesomeIcon style={{ color: '#666' }} icon={menu.icon} />
                                                        <span style={{ userSelect: 'none' }}>{menu.label}</span>
                                                    </div>
                                                    <Divider style={{ margin: 0 }} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                }
                                color={'#fff'}
                            >
                                <div className={cx('acc_wrapper')}>
                                    <div className={cx('info')}>
                                        <img src={cookies.cookieLoginStudent?.avatar} alt="" />
                                        <strong>{cookies.cookieLoginStudent?.fullName}</strong>
                                    </div>
                                </div>
                            </Tooltip>
                        ) : (
                            <div className="d-flex">
                                <Button outline onClick={() => handleOpenModal('login')} className={cx('btn-login')}>
                                    Đăng nhập
                                </Button>
                                <Button
                                    outline
                                    onClick={() => handleOpenModal('register')}
                                    className={cx('btn-register')}
                                >
                                    Đăng ký
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className={cx('header_bar')} onClick={handleNavbarToggle}>
                        <FontAwesomeIcon icon={faBarsStaggered} />
                    </div>
                </div>
                <Search />
            </Container>
            <AuthLayout />
        </header>
    );
};

export default Header;
