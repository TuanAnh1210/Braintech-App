import classNames from 'classnames/bind';
import { Col, Container, Row } from 'react-bootstrap';

import styles from './Info.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCamera,
    faCartShopping,
    faChalkboardUser,
    faGraduationCap,
    faStar,
    faUserPen,
} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
const Info = () => {
    return (
        <>
            <div className={cx('info__wrapper')}>
                <Container>
                    <Row>
                        <Col md={5} lg={3}>
                            <div className="info__user">
                                <div className={cx('profile__user')}>
                                    <img
                                        src="https://i.ytimg.com/vi/_5cG2vsphJY/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCkpMmtRUteE-kIelm2dMGhtl7D2A"
                                        alt=""
                                    />
                                    <div className={cx('profile__user--body')}>
                                        <h3>
                                            Tuian ANh
                                            <span>
                                                <FontAwesomeIcon
                                                    style={{ color: 'var(--primary-color)' }}
                                                    icon={faStar}
                                                />
                                            </span>
                                        </h3>

                                        <p>Thành viên của Braintech</p>
                                    </div>
                                    <button className={cx('update__ava--btn', 'js-edit')}>
                                        <FontAwesomeIcon icon={faCamera} />
                                    </button>
                                </div>
                                <div className={cx('profile__user--detail')}>
                                    <div className={cx('profile__user--heading')}>
                                        <h3>Thông tin</h3>
                                        <FontAwesomeIcon className={cx('icon')} icon={faUserPen} />
                                    </div>
                                    <div className={cx('profile__user--txt')}>
                                        <p>
                                            Tên: &ensp; <br />
                                            <strong> &ensp;ten</strong>{' '}
                                        </p>
                                        <p>Email: </p>&ensp;
                                        <strong className="fixText">email</strong>
                                        <p>
                                            Phone: &ensp;
                                            <br />
                                            <strong> &ensp;0987654321</strong>{' '}
                                        </p>
                                        <button className={cx('update__profile', 'js-edit')}>Chỉnh sửa</button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={7} lg={9}>
                            <Row>
                                <Col lg={6} md={12}>
                                    <div className={cx('box__courses')}>
                                        <div className={cx('box__courses--title')}>
                                            <h3>
                                                <span>
                                                    <FontAwesomeIcon className={cx('icon')} icon={faChalkboardUser} />
                                                </span>{' '}
                                                &ensp; Khóa học đang học
                                            </h3>

                                            <div className="courseLearning"></div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={6} md={12}>
                                    <div className={cx('box__courses')}>
                                        <div className={cx('box__courses--title')}>
                                            <h3>
                                                <span>
                                                    <FontAwesomeIcon className={cx('icon')} icon={faGraduationCap} />
                                                </span>{' '}
                                                &ensp; Khóa học đã hoàn thành
                                            </h3>

                                            <div className="courseLearned"></div>
                                        </div>
                                    </div>
                                </Col>

                                <Col lg={6} md={12}>
                                    <div className={cx('box__courses', 'mt')}>
                                        <div className={cx('box__courses--title')}>
                                            <h3>
                                                <span>
                                                    <FontAwesomeIcon className={cx('icon')} icon={faCartShopping} />
                                                </span>{' '}
                                                &ensp; Khóa học đã mua
                                            </h3>

                                            <div className="courseBought"></div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Info;
