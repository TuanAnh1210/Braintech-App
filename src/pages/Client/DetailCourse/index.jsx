/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames/bind';
import styles from './DetailCourse.module.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useGetDetailQuery } from '@/providers/apis/courseApi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { openModal } from '@/providers/slices/modalSlice';
import { useGetFinishLessonByCourseIdQuery } from '@/providers/apis/lessonApi';
import { useCreatePaymentUrlMutation } from '@/providers/apis/paymentApi';
import { useCookies } from 'react-cookie';
import { Empty } from 'antd';
import { useGetAllPaymentByUserQuery, useGetAllPaymentQuery } from '@/providers/apis/paymentDetail';
import { useAddSttCourseMutation } from '@/providers/apis/sttCourseApi';
import { jwtDecode } from 'jwt-decode';

const cx = classNames.bind(styles);

const DetailCourse = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [userid, setUserid] = useState(null);

    const { courseId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [handleAddSttCourse] = useAddSttCourseMutation();
    const [cookies] = useCookies(['cookieLoginStudent']);
    const [createPaymentUrl] = useCreatePaymentUrlMutation();

    const isLog = cookies.cookieLoginStudent;

    const { data: course } = useGetDetailQuery(courseId, {
        skip: !courseId,
    });

    const { data: lessonFinish } = useGetFinishLessonByCourseIdQuery(courseId, {
        skip: !courseId,
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    });

    useEffect(() => {
        if (isLog != null) {
            setIsLogin(true);
        } else {
            setIsLogin(false);
        }
    }, [isLog]);

    useEffect(() => {
        if (cookies === 'null' && cookies) {
            dispatch(openModal('login'));
        }
    }, [cookies]);

    const handleBuyCourse = async () => {
        const { data } = await createPaymentUrl({ courseId: courseId });

        location.href = data.url;

        // Tạo một thẻ <a> ẩn
        // const link = document.createElement('a');
        // link.href = data.url;
        // link.target = '_blank';
        // link.rel = 'noopener noreferrer';

        // // Kích hoạt sự kiện nhấp chuột trên thẻ <a>
        // const clickEvent = new MouseEvent('click', {
        //     view: window,
        //     bubbles: true,
        //     cancelable: true,
        // });

        // link.dispatchEvent(clickEvent);
    };

    const { data: coursePay, isLoading: coursePayLoading, refetch } = useGetAllPaymentByUserQuery();
    const dataBought = coursePay?.data?.find(
        (s) => s.user_id === userid && s.course_id._id === courseId && s.status === 'SUCCESS',
    );

    const data = cookies?.cookieLoginStudent;

    // const nextlessonId = lessonFinish?.data?.lesson_id || course?.course?.chapters?.[0]?.lessons?.[0]?._id;

    const nextlessonId = lessonFinish?.chapters
        ?.find((chapter) => chapter.isPublic)
        ?.lessons.find((lesson) => lesson.isPublic)?._id;

    const isPublicExist = course?.course?.chapters?.find((chapter) => !chapter.isPublic);
    const handleLearn = () => {
        handleAddSttCourse({ course_id: courseId }).then(() => {
            refetch();
            navigate(`/learning/${courseId}/${nextlessonId}`);
        });
    };

    useEffect(() => {
        if (cookies.cookieLoginStudent) {
            const decode = jwtDecode(data?.accessToken);
            setUserid(decode._id);
        } else {
            navigate('/');
        }
    }, [cookies]);

    return (
        <>
            <div className={cx('detail-course')}>
                <Container>
                    <Row>
                        <Col lg={8}>
                            <div>
                                <h2 className={cx('course_name')}>{course?.course?.name}</h2>
                                <p className={cx('course_text')}>{course?.course?.description}</p>
                                <div className={cx('learning__bar')}>
                                    <h1 className={cx('learning__bar--title')}>Nội dung khóa học</h1>
                                    <div className={cx('course_topic')}>
                                        {course?.course?.chapters
                                            ?.filter((chapter) => chapter.isPublic)
                                            .map((chapter) => {
                                                return (
                                                    <div
                                                        key={chapter._id}
                                                        className={cx(
                                                            'learning__chapter',
                                                            !chapter.isPublic && 'hidden',
                                                        )}
                                                    >
                                                        <h3 className={cx('learning__chapter--txt')}>{chapter.name}</h3>

                                                        {chapter.lessons
                                                            ?.filter((lesson) => lesson.isPublic)
                                                            .map((lesson, index) => (
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
                                                );
                                            })}

                                        {(course?.course?.chapters.length === 0 || isPublicExist) && (
                                            <Empty className="my-8" description="Chưa có dữ liệu" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="course_img_wrapper">
                                <img className={cx('course_img')} src={course?.course?.thumb} alt="" />
                                {!dataBought && course?.course?.price > 0 ? (
                                    <>
                                        <div className={cx('price__wrapper')}>
                                            <p className={cx('old__price')}>
                                                {course?.course?.old_price.toLocaleString()}đ
                                            </p>
                                            <p className={cx('price_cur')}>{course?.course?.price.toLocaleString()}đ</p>
                                        </div>
                                        <a onClick={handleBuyCourse}>
                                            <button className={cx('course_btn-learn')}>Mua ngay</button>
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <h4 className={cx('course_free')}>
                                            {course?.course?.price > 0 && dataBought ? 'Đã mua' : 'Miễn phí'}
                                        </h4>
                                        <div className={cx('firstLessonBtn')}>
                                            {isLogin ? (
                                                <button className={cx('course_btn-learn')} onClick={handleLearn}>
                                                    Học ngay
                                                </button>
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
