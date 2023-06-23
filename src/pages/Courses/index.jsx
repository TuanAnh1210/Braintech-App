import { Col, Container, Row } from 'react-bootstrap';
import classNames from 'classnames/bind';

import styles from './Courses.module.scss';
import Banner from '@/components/Banner/Banner';
import { base_banner } from '@/components/Banner/Base';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import images from '@/assets/images';

const cx = classNames.bind(styles);
const Courses = () => {
    const { group } = images;
    return (
        <>
            <Banner {...base_banner.banner_course} />
            <div className={cx('courses__wrapper')}>
                <Container>
                    <h1>
                        Khóa học Pro <span className={cx('pro__label')}>Mới</span>
                    </h1>
                    <Row data-course="1" className={cx('courseWrapper')}>
                        <Col lg={3} md={4}>
                            <a href="">
                                <div className={cx('courses-newest_item')}>
                                    <img
                                        src="https://res.cloudinary.com/dpjieqbsk/image/upload/v1681377441/braintech/ptvkhwcfsdeqm4pgvmib.png"
                                        alt=""
                                    />
                                    <h4>ten khoa hoc</h4>
                                    <div className={cx('courses-newest_info')}>
                                        <FontAwesomeIcon icon={faUsers} />
                                        <span>123</span>
                                        <div className={cx('price__wrapper')}>
                                            <p className={cx('old__price')}>123đ</p>
                                            <p>345đ</p>
                                        </div>
                                        {/* <p>Miễn phí</p> */}
                                    </div>
                                </div>
                            </a>
                        </Col>
                        <Col lg={3} md={4}>
                            <a href="">
                                <div className={cx('courses-newest_item')}>
                                    <img
                                        src="https://res.cloudinary.com/dpjieqbsk/image/upload/v1681377441/braintech/ptvkhwcfsdeqm4pgvmib.png"
                                        alt=""
                                    />
                                    <h4>ten khoa hoc</h4>
                                    <div className={cx('courses-newest_info')}>
                                        <FontAwesomeIcon icon={faUsers} />
                                        <span>123</span>
                                        <div className={cx('price__wrapper')}>
                                            <p className={cx('old__price')}>123đ</p>
                                            <p>345đ</p>
                                        </div>
                                        {/* <p>Miễn phí</p> */}
                                    </div>
                                </div>
                            </a>
                        </Col>
                        <Col lg={3} md={4}>
                            <a href="">
                                <div className={cx('courses-newest_item')}>
                                    <img
                                        src="https://res.cloudinary.com/dpjieqbsk/image/upload/v1681377441/braintech/ptvkhwcfsdeqm4pgvmib.png"
                                        alt=""
                                    />
                                    <h4>ten khoa hoc</h4>
                                    <div className={cx('courses-newest_info')}>
                                        <FontAwesomeIcon icon={faUsers} />
                                        <span>123</span>
                                        <div className={cx('price__wrapper')}>
                                            <p className={cx('old__price')}>123đ</p>
                                            <p>345đ</p>
                                        </div>
                                        {/* <p>Miễn phí</p> */}
                                    </div>
                                </div>
                            </a>
                        </Col>
                        <Col lg={3} md={4}>
                            <a href="">
                                <div className={cx('courses-newest_item')}>
                                    <img
                                        src="https://res.cloudinary.com/dpjieqbsk/image/upload/v1681377441/braintech/ptvkhwcfsdeqm4pgvmib.png"
                                        alt=""
                                    />
                                    <h4>ten khoa hoc</h4>
                                    <div className={cx('courses-newest_info')}>
                                        <FontAwesomeIcon icon={faUsers} />
                                        <span>123</span>
                                        <div className={cx('price__wrapper')}>
                                            <p className={cx('old__price')}>123đ</p>
                                            <p>345đ</p>
                                        </div>
                                        {/* <p>Miễn phí</p> */}
                                    </div>
                                </div>
                            </a>
                        </Col>
                        <Col lg={3} md={4}>
                            <a href="">
                                <div className={cx('courses-newest_item')}>
                                    <img
                                        src="https://res.cloudinary.com/dpjieqbsk/image/upload/v1681377441/braintech/ptvkhwcfsdeqm4pgvmib.png"
                                        alt=""
                                    />
                                    <h4>ten khoa hoc</h4>
                                    <div className={cx('courses-newest_info')}>
                                        <FontAwesomeIcon icon={faUsers} />
                                        <span>123</span>
                                        <div className={cx('price__wrapper')}>
                                            <p className={cx('old__price')}>123đ</p>
                                            <p>345đ</p>
                                        </div>
                                        {/* <p>Miễn phí</p> */}
                                    </div>
                                </div>
                            </a>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className={cx('courses__wrapper')}>
                <Container>
                    <h1>Khóa học Front-End miễn phí</h1>
                    <Row data-course="1" className={cx('courseWrapper')}>
                        <Col lg={3} md={4}>
                            <a href="">
                                <div className={cx('courses-newest_item')}>
                                    <img
                                        src="https://res.cloudinary.com/dpjieqbsk/image/upload/v1681377441/braintech/ptvkhwcfsdeqm4pgvmib.png"
                                        alt=""
                                    />
                                    <h4>ten khoa hoc</h4>
                                    <div className={cx('courses-newest_info')}>
                                        <FontAwesomeIcon icon={faUsers} />
                                        <span>123</span>
                                        <div className={cx('price__wrapper')}>
                                            <p className={cx('old__price')}>123đ</p>
                                            <p>345đ</p>
                                        </div>
                                        {/* <p>Miễn phí</p> */}
                                    </div>
                                </div>
                            </a>
                        </Col>
                        <Col lg={3} md={4}>
                            <a href="">
                                <div className={cx('courses-newest_item')}>
                                    <img
                                        src="https://res.cloudinary.com/dpjieqbsk/image/upload/v1681377441/braintech/ptvkhwcfsdeqm4pgvmib.png"
                                        alt=""
                                    />
                                    <h4>ten khoa hoc</h4>
                                    <div className={cx('courses-newest_info')}>
                                        <FontAwesomeIcon icon={faUsers} />
                                        <span>123</span>
                                        <div className={cx('price__wrapper')}>
                                            <p className={cx('old__price')}>123đ</p>
                                            <p>345đ</p>
                                        </div>
                                        {/* <p>Miễn phí</p> */}
                                    </div>
                                </div>
                            </a>
                        </Col>
                        <Col lg={3} md={4}>
                            <a href="">
                                <div className={cx('courses-newest_item')}>
                                    <img
                                        src="https://res.cloudinary.com/dpjieqbsk/image/upload/v1681377441/braintech/ptvkhwcfsdeqm4pgvmib.png"
                                        alt=""
                                    />
                                    <h4>ten khoa hoc</h4>
                                    <div className={cx('courses-newest_info')}>
                                        <FontAwesomeIcon icon={faUsers} />
                                        <span>123</span>
                                        <div className={cx('price__wrapper')}>
                                            <p className={cx('old__price')}>123đ</p>
                                            <p>345đ</p>
                                        </div>
                                        {/* <p>Miễn phí</p> */}
                                    </div>
                                </div>
                            </a>
                        </Col>
                        <Col lg={3} md={4}>
                            <a href="">
                                <div className={cx('courses-newest_item')}>
                                    <img
                                        src="https://res.cloudinary.com/dpjieqbsk/image/upload/v1681377441/braintech/ptvkhwcfsdeqm4pgvmib.png"
                                        alt=""
                                    />
                                    <h4>ten khoa hoc</h4>
                                    <div className={cx('courses-newest_info')}>
                                        <FontAwesomeIcon icon={faUsers} />
                                        <span>123</span>
                                        <div className={cx('price__wrapper')}>
                                            <p className={cx('old__price')}>123đ</p>
                                            <p>345đ</p>
                                        </div>
                                        {/* <p>Miễn phí</p> */}
                                    </div>
                                </div>
                            </a>
                        </Col>
                        <Col lg={3} md={4}>
                            <a href="">
                                <div className={cx('courses-newest_item')}>
                                    <img
                                        src="https://res.cloudinary.com/dpjieqbsk/image/upload/v1681377441/braintech/ptvkhwcfsdeqm4pgvmib.png"
                                        alt=""
                                    />
                                    <h4>ten khoa hoc</h4>
                                    <div className={cx('courses-newest_info')}>
                                        <FontAwesomeIcon icon={faUsers} />
                                        <span>123</span>
                                        <div className={cx('price__wrapper')}>
                                            <p className={cx('old__price')}>123đ</p>
                                            <p>345đ</p>
                                        </div>
                                        {/* <p>Miễn phí</p> */}
                                    </div>
                                </div>
                            </a>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className={cx('group')}>
                <Container>
                    <Row style={{ alignItems: 'center' }}>
                        <Col lg={7} md={7}>
                            <div className={cx('group__text')}>
                                <h3>Tham gia cộng đồng học viên BrainTech trên Facebook</h3>
                                <p>
                                    Hàng nghìn người khác đang học lộ trình giống như bạn. Hãy tham gia hỏi đáp, chia sẻ
                                    và hỗ trợ nhau trong quá trình học nhé.
                                </p>

                                <a href="https://www.facebook.com/groups/f8official">Tham gia nhóm</a>
                            </div>
                        </Col>
                        <Col lg={5} md={5}>
                            <div className={cx('group__img')}>
                                <img src={group} alt="" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Courses;
