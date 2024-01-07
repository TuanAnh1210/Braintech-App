import classNames from 'classnames/bind';
import { Col, Container, Row } from 'react-bootstrap';

import styles from './About.module.scss';
import images from '@/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightDots, faBrain, faPeopleCarryBox, faSeedling } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const cx = classNames.bind(styles);
const About = () => {
    const { about, core, ta } = images;
    return (
        <>
            <div className={cx('about_intro')}>
                <Container>
                    <Row style={{ alignItems: 'center' }}>
                        <Col lg={6} md={6}>
                            <div className={cx('about_intro-img')}>
                                <img src={about} alt="" />
                            </div>
                        </Col>
                        <Col lg={6} md={6}>
                            <div className={cx('about_intro-text')}>
                                <h1>Brain Tech</h1>
                                <p>
                                    Brain Tech tin rằng mỗi người đều có những tiềm năng vô hạn để trở nên giỏi giang.
                                    Vấn đề là họ không áp dụng đúng phương pháp để việc học hiệu quả hơn. Vì vậy Brain
                                    Tech mong muốn giúp cho những người gặp khó khăn trong việc học hành nói chung và
                                    học lập trình nói riêng được tiếp cận các phương pháp, kinh nghiệm học lập trình
                                    thông minh để trở nên giỏi thực sự.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className={cx('about_goal')}>
                <Container>
                    <h2 style={{ fontWeight: '600' }}>GIÁ TRỊ CỐT LÕI</h2>
                    <Row style={{ alignItems: 'center', flexWrap: 'wrap-reverse' }}>
                        <Col lg={6} md={6}>
                            <div className={cx('about_goal-list')}>
                                <div className={cx('about_goal-item')}>
                                    <FontAwesomeIcon className={cx('icon')} icon={faPeopleCarryBox} />
                                    <span>Sự tử tế</span>
                                </div>
                                <div className={cx('about_goal-item')}>
                                    <FontAwesomeIcon className={cx('icon')} icon={faBrain} />

                                    <span>Tư duy số</span>
                                </div>
                                <div className={cx('about_goal-item')}>
                                    <FontAwesomeIcon className={cx('icon')} icon={faArrowUpRightDots} />

                                    <span> Không ngừng học</span>
                                </div>
                                <div className={cx('about_goal-item')}>
                                    <FontAwesomeIcon className={cx('icon')} icon={faSeedling} />

                                    <span>Tư duy bền vững</span>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6} md={6}>
                            <div className={cx('about_goal-img')}>
                                <img src={core} alt="" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className={cx('about_hr')}>
                <Container>
                    <h2 style={{ fontWeight: 600, textAlign: 'center', marginBottom: '32px' }}>
                        ĐỘI NGŨ CỦA BRAINTECH
                    </h2>

                    <Row>
                        <Col md={6} lg={3}>
                            <div className={cx('about_hr-card')}>
                                <img src={ta} alt="" />
                                <h4>Nguyễn Tuấn Anh</h4>
                                <p>Founder</p>
                                <div className={cx('about_hr-contact')}>
                                    <a href="https://www.facebook.com/bean.tuan.777/">
                                        <FontAwesomeIcon
                                            style={{ color: '#0c71c3' }}
                                            className={cx('icon')}
                                            icon={faFacebook}
                                        />
                                    </a>
                                    <a href="https://github.com/TuanAnh1210?tab=repositories">
                                        <FontAwesomeIcon
                                            style={{ color: '#242424' }}
                                            className={cx('icon')}
                                            icon={faGithub}
                                        />
                                    </a>
                                    <a href="https://github.com/TuanAnh1210?tab=repositories">
                                        <FontAwesomeIcon
                                            style={{ color: '#784BA0' }}
                                            className={cx('icon')}
                                            icon={faLinkedin}
                                        />
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} lg={3}>
                            <div className={cx('about_hr-card')}>
                                <img src={ta} alt="" />
                                <h4>Nguyễn Tuấn Anh</h4>
                                <p>CEO</p>
                                <div className={cx('about_hr-contact')}>
                                    <a href="https://www.facebook.com/bean.tuan.777/">
                                        <FontAwesomeIcon
                                            style={{ color: '#0c71c3' }}
                                            className={cx('icon')}
                                            icon={faFacebook}
                                        />
                                    </a>
                                    <a href="https://github.com/TuanAnh1210?tab=repositories">
                                        <FontAwesomeIcon
                                            style={{ color: '#242424' }}
                                            className={cx('icon')}
                                            icon={faGithub}
                                        />
                                    </a>
                                    <a href="https://github.com/TuanAnh1210?tab=repositories">
                                        <FontAwesomeIcon
                                            style={{ color: '#784BA0' }}
                                            className={cx('icon')}
                                            icon={faLinkedin}
                                        />
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} lg={3}>
                            <div className={cx('about_hr-card')}>
                                <img src={ta} alt="" />
                                <h4>Nguyễn Tuấn Anh</h4>
                                <p>CTO</p>
                                <div className={cx('about_hr-contact')}>
                                    <a href="https://www.facebook.com/bean.tuan.777/">
                                        <FontAwesomeIcon
                                            style={{ color: '#0c71c3' }}
                                            className={cx('icon')}
                                            icon={faFacebook}
                                        />
                                    </a>
                                    <a href="https://github.com/TuanAnh1210?tab=repositories">
                                        <FontAwesomeIcon
                                            style={{ color: '#242424' }}
                                            className={cx('icon')}
                                            icon={faGithub}
                                        />
                                    </a>
                                    <a href="https://github.com/TuanAnh1210?tab=repositories">
                                        <FontAwesomeIcon
                                            style={{ color: '#784BA0' }}
                                            className={cx('icon')}
                                            icon={faLinkedin}
                                        />
                                    </a>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} lg={3}>
                            <div className={cx('about_hr-card')}>
                                <img src={ta} alt="" />
                                <h4>Nguyễn Tuấn Anh</h4>
                                <p>Founder</p>
                                <div className={cx('about_hr-contact')}>
                                    <a href="https://www.facebook.com/bean.tuan.777/">
                                        <FontAwesomeIcon
                                            style={{ color: '#0c71c3' }}
                                            className={cx('icon')}
                                            icon={faFacebook}
                                        />
                                    </a>
                                    <a href="https://github.com/TuanAnh1210?tab=repositories">
                                        <FontAwesomeIcon
                                            style={{ color: '#242424' }}
                                            className={cx('icon')}
                                            icon={faGithub}
                                        />
                                    </a>
                                    <a href="https://github.com/TuanAnh1210?tab=repositories">
                                        <FontAwesomeIcon
                                            style={{ color: '#784BA0' }}
                                            className={cx('icon')}
                                            icon={faLinkedin}
                                        />
                                    </a>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className={cx('about_whatToSale')}>
                <section className={cx('about_whatToSale_header')}>
                    <h3>BẠN NHẬN ĐƯỢC GÌ TỪ BrainTech?</h3>
                    <Container>
                        <Row>
                            <Col md={6} lg={6}>
                                <div className={cx('about_textContent')}>
                                    <h4>1. Sự thành thạo</h4>
                                    <p>
                                        Các bài học đi đôi với thực hành, làm bài kiểm tra ngay trên trang web và bạn
                                        luôn có sản phẩm thực tế sau mỗi khóa học.
                                    </p>
                                </div>
                            </Col>
                            <Col md={6} lg={6}>
                                <div className={cx('about_textContent')}>
                                    <h4>2. Tính tự học</h4>
                                    <p>
                                        Một con người chỉ thực sự trưởng thành trong sự nghiệp nếu họ biết cách tự thu
                                        nạp kiến thức mới cho chính mình..
                                    </p>
                                </div>
                            </Col>
                            <Col md={6} lg={6}>
                                <div className={cx('about_textContent')}>
                                    <h4>3. Tiết kiệm thời gian</h4>
                                    <p>
                                        Thay vì chật vật vài năm thì chỉ cần 4-6 tháng để có thể bắt đầu công việc đầu
                                        tiên với vị trí Intern tại công ty IT.
                                    </p>
                                </div>
                            </Col>
                            <Col md={6} lg={6}>
                                <div className={cx('about_textContent')}>
                                    <h4>4. Làm điều quan trọng</h4>
                                    <p>
                                        Chỉ học và làm những điều quan trọng để đạt được mục tiêu đi làm được trong thời
                                        gian ngắn nhất.
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </div>
        </>
    );
};

export default About;
