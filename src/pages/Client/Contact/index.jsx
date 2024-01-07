import classNames from 'classnames/bind';
import styles from './Contact.module.scss';
import { Col, Container, Row } from 'react-bootstrap';

const cx = classNames.bind(styles);
const Contact = () => {
    return (
        <>
            <div className={cx('contact__wrapper')}>
                <Container>
                    <h1 className={cx('contact__heading')}>Liên hệ</h1>
                    <p className={cx('contact__sub')}>
                        Chúng tôi luôn sẵn sàng tiếp nhận mọi ý kiến ​đóng góp và giải đáp những yêu cầu của bạn.
                        <br />
                        Hãy liên hệ ngay với chúng tôi
                    </p>
                    <Row style={{ alignItems: 'center' }}>
                        <Col md={6} lg={6}>
                            <form className={cx('form__contact')} action="">
                                <div className={cx('form__group')}>
                                    <label>Họ tên</label>
                                    <input type="text" required />
                                    <p className="error"></p>
                                </div>
                                <div className={cx('form__group')}>
                                    <label>Email</label>
                                    <input type="text" required />
                                    <p className="error"></p>
                                </div>
                                <div className={cx('form__group')}>
                                    <label>Điện thoại</label>
                                    <input type="text" required />
                                    <p className="error"></p>
                                </div>
                                <div className={cx('form__group')}>
                                    <label>Nội dung</label>
                                    <textarea name="" id="" cols="30" rows="10" required></textarea>
                                    <p className="error"></p>
                                </div>

                                <button className={cx('btn__send')}>Gửi đi</button>
                            </form>
                        </Col>
                        <Col md={6} lg={6}>
                            <section className="index-module_col__2EQm9 index-module_c-12__u7UXF index-module_m-12__2CxUL index-module_l-6__JoV9k">
                                <iframe
                                    style={{ width: '100%', border: 0 }}
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.863855881387!2d105.7445984141118!3d21.03813279283602!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454b991d80fd5%3A0x53cefc99d6b0bf6f!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1671415003992!5m2!1svi!2s"
                                    width="600"
                                    height="450"
                                    allowfullscreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </section>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Contact;
