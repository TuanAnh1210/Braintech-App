/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames/bind';
import styles from './DetailCourse.module.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useGetDetailQuery } from '@/providers/apis/courseApi';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '@/providers/slices/modalSlice';
import { jwtDecode } from 'jwt-decode';
import { useGetUsersQuery } from '@/providers/apis/userApi';
import { useGetFinishLessonQuery } from '@/providers/apis/lessonApi';
import { useCreatePaymentUrlMutation } from '@/providers/apis/paymentApi';

const cx = classNames.bind(styles);

const DetailCourse = () => {
    const { id } = useParams();
    const [param, setSearchParams] = useState();
    const [userId, setUserId] = useState(null);
    const { data: dataUser, isLoading: loadingUser } = useGetUsersQuery();
    const { data, isLoading, isFetching, isError } = useGetDetailQuery(id);
    const [_accessToken, setAccessToken] = useLocalStorage('access_token', null);
    const { data: dataFinish, isLoading: loadingFinish, refetch: refetchDataFinish } = useGetFinishLessonQuery(userId);

    const [createPaymentUrl] = useCreatePaymentUrlMutation();

    const isLog = JSON.parse(localStorage.getItem('access_token'));
    const currentLesson = dataFinish?.data?.filter((dFinish) => {
        return dFinish.course_id === id;
    });

    const [isLogin, setIsLogin] = useState(false);

    const user = useSelector((state) => state.user);
    useEffect(() => {
        if (currentLesson?.length > 0 && !isLoading && !loadingFinish) {
            setSearchParams(currentLesson[currentLesson.length - 1]?.lesson_id);
        } else {
            setSearchParams(data?.course?.chapters[0].lessons[0]?._id);
        }
        const token = JSON.parse(access_token);

        if (token !== null) {
            const decode = jwtDecode(user?.token);
            const idLog = decode.data._id;
            const idUser = dataUser?.data?.find((user) => user?._id === idLog)?._id;
            setUserId(idUser);
        }
    }, [loadingFinish, dataUser, data]);

    const dispatch = useDispatch();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        if (isLog != null) {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    }, [user]);

    const access_token = localStorage.getItem('access_token');
    useEffect(() => {
        if (access_token === 'null' && access_token) {
            dispatch(openModal('login'));
        }
    }, [access_token]);

    const handleBuyCourse = async () => {
        const { data } = await createPaymentUrl({ courseId: id });

        // Tạo một thẻ <a> ẩn
        const link = document.createElement('a');
        link.href = data.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        // Kích hoạt sự kiện nhấp chuột trên thẻ <a>
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        });

        link.dispatchEvent(clickEvent);
    };

    return (
        <>
            <div className={cx('detail-course')}>
                <Container>
                    <Row>
                        <Col lg={8}>
                            <div>
                                <h2 className={cx('course_name')}>{data?.course?.name}</h2>
                                <p className={cx('course_text')}>{data?.course?.description}</p>
                                <div className={cx('learning__bar')}>
                                    <h1 className={cx('learning__bar--title')}>Nội dung khóa học</h1>
                                    <div className={cx('course_topic')}>
                                        {data?.course?.chapters?.map((chapter) => (
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
                                <img className={cx('course_img')} src={data?.course?.thumb} alt="" />
                                {data?.course?.price > 0 ? (
                                    <>
                                        <div className={cx('price__wrapper')}>
                                            <p className={cx('old__price')}>
                                                {data?.course?.old_price.toLocaleString()}đ
                                            </p>
                                            <p className={cx('price_cur')}>{data?.course?.price.toLocaleString()}đ</p>
                                        </div>
                                        <a onClick={handleBuyCourse}>
                                            <button className={cx('course_btn-learn')}>Mua ngay</button>
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <h4 className={cx('course_free')}>Miễn phí</h4>
                                        <div className={cx('firstLessonBtn')}>
                                            {isLogin ? (
                                                <Link to={`/learning/${id}?id=${param}`}>
                                                    <button className={cx('course_btn-learn')}>Học ngay</button>
                                                </Link>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        dispatch(openModal('login'));
                                                    }}
                                                    className={cx('course_btn-learn')}
                                                >
                                                    Học ngay
                                                </button>
                                            )}
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
