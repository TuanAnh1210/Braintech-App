import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { Container } from 'react-bootstrap';
import images from '@/assets/images';
import { useState } from 'react';
import Button from '../../../components/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import useLocalStorage from '@/hooks/useLocalStorage';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';

const cx = classNames.bind(styles);

const Header = () => {
    const [_accessToken, setAccessToken] = useLocalStorage('access_token', null);

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

    return (
        <header>
            <Container>
                <div className={cx('wrapper')}>
                    <div className={cx('logo')}>
                        <a href="/">
                            <img src={images.logo} alt="Braintech" />
                            <p>Brain Tech Edu</p>
                        </a>
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
                        {_accessToken ? (
                            <div className={cx('acc_wrapper')}>
                                <div className={cx('info')}>
                                    <img src={_accessToken?.avatar} alt="" />
                                    <strong>{_accessToken?.fullname}</strong>
                                </div>
                                <ul className={cx('acc_menu')}>
                                    <li className={cx('accMenu_item')}>
                                        <a className="accMenu_link" href="<?= $GLOBALS['domainPage'] ?>/info">
                                            Tài khoản
                                        </a>
                                    </li>

                                    <li className={cx('accMenu_item')}>
                                        <a className="accMenu_link" href="<?= $GLOBALS['domainPage'] ?>/account/logout">
                                            Đăng xuất
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <Button outline className={cx('btn-login')} to={'/login'}>
                                Đăng nhập
                            </Button>
                        )}
                    </div>
                    <div className={cx('header_bar')} onClick={handleNavbarToggle}>
                        <FontAwesomeIcon icon={faBarsStaggered} />
                    </div>
                </div>
            </Container>
        </header>
    );
};

export default Header;
