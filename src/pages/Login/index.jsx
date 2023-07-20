import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import images from '@/assets/images';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleSwitchForm = () => {
        setIsLogin(!isLogin);
    };
    const { bg_blue } = images;

    return (
        <div
            style={{
                background: `url(${bg_blue}) center center / cover no-repeat`,
            }}
            className={cx('account__wrapper')}
        >
            <button
                className={cx('go-home')}
                onClick={() => {
                    navigate(-1);
                }}
            >
                <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <div className={cx('form__wrapper')}>
                <form className={cx('form__login', { ani: !isLogin })}>
                    <h2 className={cx('form__title')}>Đăng nhập</h2>
                    <div className={cx('form__group')}>
                        <label>Email</label>
                        <input id="email_login" type="text" placeholder="Email" name="email_login" />
                        <p className="error"></p>
                    </div>
                    <div className={cx('form__group')}>
                        <label>Mật khẩu</label>
                        <input id="pass_login" type="password" placeholder="Mật khẩu" name="pass_login" />
                        <p className="error"></p>
                    </div>
                    <a className={cx('forgot__pass')} href="">
                        Quên mật khẩu
                    </a>
                    <button className={cx('btn__login')}>Đăng nhập</button>

                    <div className={cx('IFLxoy')}>
                        <div className={cx('IFLxoy--left')}></div>
                        <span className={cx('IFLxoy--title')}>HOẶC</span>
                        <div className={cx('IFLxoy--right')}></div>
                    </div>
                    <button className={cx('login--with-gg')}>
                        <FontAwesomeIcon className={cx('icon--gg')} icon={faGoogle} />
                        <p className={cx('login--gg')}>Đăng nhập với Google</p>
                    </button>
                </form>
                <form className={cx('form__regis', { ani: isLogin })}>
                    <h2 className={cx('form__title', 'regis')}>Đăng ký</h2>
                    <div className={cx('form__group')}>
                        <label>Họ tên</label>
                        <input type="text" placeholder="Họ và tên" id="name_regis" name="name_regis" />
                        <p className="error"></p>
                    </div>
                    <div className={cx('form__group')}>
                        <label>Email</label>
                        <input type="text" placeholder="Email" id="email_regis" name="email_regis" />
                        <p className="error"></p>
                    </div>
                    <div className={cx('form__group')}>
                        <label>Mật khẩu</label>
                        <input type="password" placeholder="Mật khẩu" id="pass_regis" name="pass_regis" />
                        <p className="error"></p>
                    </div>
                    <div className={cx('form__group')}>
                        <label>Nhập lại mật khẩu</label>
                        <input type="password" placeholder="Xác nhận mật khẩu" id="rePass_regis" />
                        <p className="error"></p>
                    </div>
                    <button className={cx('btn__regis')}>Đăng ký</button>
                </form>
                <div className={cx('overlay_container', { isRegis: !isLogin })}>
                    <div className={cx('overlay-login')}>
                        <div className={cx('isInfoRegis', 'close')}>
                            <h2 className={cx('overlay-title')}>Bạn chưa có tài khoản ?</h2>
                            <p className={cx('overlay-sub')}>
                                Đăng ký ngay để bắt đầu học lập trình với BrainTech nhé !
                            </p>
                            <button className={cx('overlay-btn')} onClick={handleSwitchForm}>
                                Đăng ký ngay
                            </button>
                        </div>
                        <div className={cx('isInfoLogin')}>
                            <h2 className={cx('overlay-title')}>Chào mừng bạn đến với BrainTech</h2>
                            <p className={cx('overlay-sub')}>Đăng nhập ngay để học những bài học bổ ích nhé !</p>
                            <button className={cx('overlay-btn')} onClick={handleSwitchForm}>
                                Đăng nhập ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
