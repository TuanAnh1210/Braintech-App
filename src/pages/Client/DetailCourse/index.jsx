import classNames from 'classnames/bind';
import styles from './DetailCourse.module.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { useGetDetailQuery } from '@/providers/apis/courseApi';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '@/providers/slices/modalSlice';
import { jwtDecode } from 'jwt-decode';
import { useGetUsersQuery } from '@/providers/apis/userApi';
import { useGetFinishLessonQuery } from '@/providers/apis/lessonApi';
const cx = classNames.bind(styles);
const DetailCourse = () => {
    const { id } = useParams();
    const [param, setSearchParams] = useState();
    const [userId, setUserId] = useState(null);
    const { data: dataUser, isLoading: loadingUser } = useGetUsersQuery();
    const { data, isLoading, isFetching, isError } = useGetDetailQuery(id);
    const [_accessToken, setAccessToken] = useLocalStorage('access_token', null);
    const { data: dataFinish, isLoading: loadingFinish, refetch: refetchDataFinish } = useGetFinishLessonQuery(userId);

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
            setSearchParams(data?.courses?.chapters[0].lessons[0]?._id);
        }
        const token = JSON.parse(access_token);

        if (token !== null) {
            const decode = jwtDecode(user?.token);
            const idLog = decode.data._id;
            const idUser = dataUser?.data?.find((user) => user._id === idLog)._id;
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
