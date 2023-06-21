import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import { Col, Container, Row } from 'react-bootstrap';
import images from '@/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

const Footer = () => {
    return (
        <footer style={{ background: `url(${images.footer}) center center / cover no-repeat` }}>
            <Container>
                <Row>
                    <Col md={6} lg={4}>
                        <div className={cx('footer__logo')}>
                            <img src={images.logo} alt="" />
                            <p className={cx('footer__title')}>Học Lập Trình Để Đi Làm</p>
                        </div>
                        <div className={cx('footer__logo')}>
                            <FontAwesomeIcon className={cx('icon')} icon={faPhone} />
                            <p className={cx('text_first')}>0386520536</p>
                        </div>
                        <div className={cx('footer__logo')}>
                            <FontAwesomeIcon className={cx('icon')} icon={faEnvelope} />
                            <p className={cx('text_first')}>braintech0852131210@gmail.com</p>
                        </div>
                        <div className={cx('footer__logo')}>
                            <FontAwesomeIcon className={cx('icon')} icon={faMapLocationDot} />
                            <p className={cx('text_first')}>
                                Tòa nhà FPT Polytechnic, phố Trịnh Văn Bô, phường Phương Canh, quận Nam Từ Liêm, TP Hà
                                Nội
                            </p>
                        </div>
                    </Col>
                    <Col md={6} lg={2} className="col-12 col-md-6 col-lg-2">
                        <div className={cx('footer__desc')}>
                            <h3 style={{ height: '50px' }}>VỀ BrainTech</h3>
                            <p>Giới thiệu</p>
                            <p>Cơ hội việc làm</p>
                        </div>
                    </Col>
                    <Col md={6} lg={2} className="col-12 col-md-6 col-lg-2">
                        <div className={cx('footer__desc')}>
                            <h3 style={{ height: '50px' }}>HỖ TRỢ</h3>
                            <p>Liên hệ</p>
                            <p>Bảo mật</p>
                            <p>Điều khoản</p>
                        </div>
                    </Col>
                    <Col md={6} lg={4} className="col-12 col-md-6 col-lg-4">
                        <div className={cx('footer__desc')}>
                            <h3 style={{ height: '50px' }}>Công Ty Cổ Phần Công Nghệ Giáo Dục BrainTech</h3>
                            <p>Mã số thuế: 0109922901</p>
                            <p>Ngày thành lập: 04/03/2022</p>
                            <p>
                                Lĩnh vực: Công nghệ, giáo dục, lập trình. BrainTech xây dựng và phát triển những sản
                                phẩm mang lại giá trị cho cộng đồng.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
