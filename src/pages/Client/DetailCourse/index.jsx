import classNames from 'classnames/bind';
import styles from './DetailCourse.module.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useGetDetailQuery } from '@/providers/apis/courseApi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useAddSttCourseMutation } from '@/providers/apis/sttCourseApi';

const cx = classNames.bind(styles);
const DetailCourse = () => {
    const { id } = useParams();
    const { data, isLoading, isFetching, isError } = useGetDetailQuery(id);
    const [_accessToken, setAccessToken] = useLocalStorage('access_token', null);
    const [handleAddSttCourse] = useAddSttCourseMutation();

    const navigate = useNavigate();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleLearnCourse = () => {
        // if (!_accessToken) {
        //     return navigate('/login');
        // }
        // handleAddSttCourse();
    };
    return (
        <>
            <div className={cx('detail-course')}>
                <Container>
                    <Row>
                        <Col lg={8}>
                            <div>
                                <h2 className={cx('course_name')}>{data?.courses?.name}</h2>
                                <p className={cx('course_text')}>{data?.courses?.description}</p>
                                <div className={cx('learning__bar')}>
                                    <h1 className={cx('learning__bar--title')}>Nội dung khóa học</h1>
                                    <div className={cx('course_topic')}>
                                        {data?.courses?.chapters?.map((chapter) => (
                                            <div key={chapter._id} className={cx('learning__chapter')}>
                                                <h3 className={cx('learning__chapter--txt')}>{chapter.name}</h3>
                                                {chapter.lessons.map((lesson, index) => (
                                                    <div key={lesson._id} className={cx('trackItem')}>
                                                        <h3 className={cx('trackItem--title')}>
                                                            {index + 1}. {lesson.name}
                                                            <span>
                                                                <FontAwesomeIcon
                                                                    style={{ color: '#f76b1c' }}
                                                                    icon={faGraduationCap}
                                                                />
                                                            </span>
                                                        </h3>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="course_img_wrapper">
                                <img className={cx('course_img')} src={data?.courses?.thumb} alt="" />
                                {data?.courses?.price > 0 ? (
                                    <>
                                        <div className={cx('price__wrapper')}>
                                            <p className={cx('old__price')}>
                                                {data?.courses?.old_price.toLocaleString()}đ
                                            </p>
                                            <p className={cx('price_cur')}>{data?.courses?.price.toLocaleString()}đ</p>
                                        </div>
                                        <a href="">
                                            <button className={cx('course_btn-learn')}>Mua ngay</button>
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <h4 className={cx('course_free')}>Miễn phí</h4>
                                        <div className={cx('firstLessonBtn')}>
                                            <Link to={`/learning/${id}`}>
                                                <button onClick={handleLearnCourse} className={cx('course_btn-learn')}>
                                                    Học ngay
                                                </button>
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default DetailCourse;
