/* eslint-disable react-hooks/exhaustive-deps */
import { faBars, faChevronLeft, faCircleCheck, faNoteSticky } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container } from 'react-bootstrap';
import classNames from 'classnames/bind';
import { Spin } from 'antd';
import Draggable from 'react-draggable';
import { useCookies } from 'react-cookie';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';

import { useGetCourseLearningQuery } from '@/providers/apis/courseApi';
import { useAddFinishLessonMutation, useGetCountQuery, useGetLessonByIdQuery } from '@/providers/apis/lessonApi';
import { useAddSttCourseMutation } from '@/providers/apis/sttCourseApi';

import VideoYoutubePlayer from '@/components/VideoPlayer/VideoYoutubePlayer';
import VideoCloudinaryPlayer from '@/components/VideoPlayer/VideoCloudinaryPlayer';
import Comments from './Comments';

import images from '@/assets/images';

import styles from './Learning.module.scss';
const cx = classNames.bind(styles);

const Learning = () => {
    const { courseId, lessonId } = useParams();

    const [progressVideo, setProgessVideo] = useState(0); // tiến độ video [0-100]
    const [openStorage, setOpenStorage] = useState(false);
    const [totalLesson, setTotalLesson] = useState(0); // Tổng khóa học
    const [isModalShown, setIsModalShown] = useState(false);
    const [progressCourse, setProgessCourse] = useState(0);

    const mainView = useRef(null);
    const intervalRef = useRef();

    const [cookies] = useCookies(['cookieLoginStudent']);

    const navigate = useNavigate();

    const [handleAddFinishLesson] = useAddFinishLessonMutation();
    const [handleAddSttCourse] = useAddSttCourseMutation();

    const { data: countLessonFinish, refetch: refetchCount } = useGetCountQuery(courseId);
    const { data: course, isLoading, refetch: refetchCourse } = useGetCourseLearningQuery(courseId); // các bài học của khóa học
    const { data: currentLesson } = useGetLessonByIdQuery(lessonId, {
        skip: !lessonId,
    }); // lấy ra tất cả các khóa học để thực hiện lọc

    const handleGetTime = (event) => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        const player = event.target;
        const totalDuration = player.getDuration();
        intervalRef.current = setInterval(() => {
            const currentTime = player.getCurrentTime();
            const timeCatched = Math.floor((currentTime / totalDuration) * 100);
            setProgessVideo(timeCatched);
        }, 3000);
    };

    const handleLearnCourse = () => {
        const data = {
            user_id: 'userId',
            course_id: courseId,
        };
        handleAddSttCourse(data);
    };

    const lessons = course?.data?.chapters
        .map((chapter) => {
            return chapter.lessons;
        })
        .flat();

    const handleNext = () => {
        const lessonIndex = lessons.findIndex((lesson) => lesson._id === lessonId);
        const nextLessonId = lessons?.[lessonIndex + 1]?._id;
        navigate(`/learning/${courseId}/${nextLessonId}`);
    };

    const handleSetFinish = async () => {
        setIsModalShown(true);
        await handleAddFinishLesson({
            course_id: courseId,
            lesson_id: lessonId,
        });

        refetchCourse();
        refetchCount();
        handleNext();

        setProgessVideo(0);
        clearInterval(intervalRef.current);
    };

    // useEffect(() => {
    //     setIsModalShown(false);

    //     if (progressVideo >= 95) {
    //         setIsModalShown(true);
    //     } else if (countLessonFinish?.count === totalLesson) {
    //         setIsModalShown(false);
    //     }
    // }, [progressVideo, isModalShown]);

    // Nếu chưa đăng nhập cho về trang chi tiết khóa học
    useEffect(() => {
        mainView.current?.scrollIntoView({ behavior: 'smooth' }); // luôn luôn view ở video
        setProgessVideo(0);
        setIsModalShown(false);

        const access_token = cookies.cookieLoginStudent;

        if (!access_token && access_token !== 'null') {
            navigate(`/detail/${courseId}`);
        }
    }, []);

    useEffect(() => {
        const count = course?.data?.chapters?.reduce((total, chap) => total + chap.lessons.length, 0);
        const progressDone = Math.floor((countLessonFinish?.count / count) * 100);
        setProgessCourse(progressDone);
        setTotalLesson(count);
    }, [course, countLessonFinish]);

    if (isLoading) return <Spin fullscreen />;

    return (
        <div className="main">
            <header className={cx('header')}>
                {isModalShown && (
                    <></>
                    // <Draggable>
                    //     <div className={cx('message__success')}>
                    //         <h2>Bạn đã hoàn thành bài học này!!</h2>
                    //         <h4>
                    //             {/* Nhấn {`"Yes"`} để {true ? 'chuyển bài' : 'mở khóa'} nhé */}
                    //             Nhấn {`"Yes"`} để chuyển bài nhé
                    //         </h4>
                    //         <div className={cx('btn__delete-container')}>
                    //             <button onClick={handleSetFinish} className={cx('yes')}>
                    //                 Yes
                    //             </button>
                    //         </div>
                    //     </div>
                    // </Draggable>
                )}
                <Container fluid style={{ height: '100%' }}>
                    <div className={cx('header__wrapper')}>
                        <div className={cx('header--left')}>
                            <div className={cx('header__back')}>
                                <button
                                    className={cx('button__back btn btn-outline-primary')}
                                    onClick={() => navigate(`/detail/${courseId}`)}
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                            </div>
                            <div className={cx('header__logo')}>
                                <Link to="/">
                                    <img src={images?.logo} alt="" />
                                    <p>{course?.data?.name}</p>
                                </Link>
                            </div>
                        </div>
                        <div className={cx('header__actions')}>
                            <div className={cx('header__progress')}>
                                <p className={cx('header__progress--txt')}>
                                    Tiến độ: &emsp;
                                    <span className="progress_learned">{countLessonFinish?.count}</span>/
                                    <span className="progress_lesson">{totalLesson}</span>
                                </p>
                                <div className="progress">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: progressCourse + '%' }}
                                        aria-valuenow={progressCourse}
                                        aria-valuemin="0"
                                        aria-valuemax={progressCourse}
                                    >
                                        {progressCourse}%
                                    </div>
                                </div>
                            </div>
                            <div className={cx('header__cert')}>
                                {countLessonFinish?.count === totalLesson ? (
                                    <Link
                                        onClick={handleLearnCourse}
                                        className={cx('header__cert--link')}
                                        to={`/certificate/${courseId}`}
                                    >
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            data-toggle="tooltip"
                                            data-placement="bottom"
                                            title="Hoàn thành hết các bài học bạn sẽ nhận được chứng chỉ"
                                        >
                                            Nhận chứng chỉ
                                        </button>
                                    </Link>
                                ) : (
                                    <p className={cx('header__cert--lock')}>Nhận chứng chỉ</p>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </header>

            <div className={cx('content')}>
                <Container fluid>
                    <div className={cx('learning__wrapper')}>
                        <div className={cx('learning__video')} ref={mainView}>
                            <div id="player">
                                {currentLesson?.source_type === 'youtube' ? (
                                    <VideoYoutubePlayer
                                        url={currentLesson.url_video}
                                        handleGetTime={handleGetTime}
                                        handleSetFinish={handleSetFinish}
                                    />
                                ) : (
                                    <VideoCloudinaryPlayer
                                        url={currentLesson.url_video}
                                        setIsModalShown={setIsModalShown}
                                        handleSetFinish={handleSetFinish}
                                    />
                                )}
                            </div>
                            <Comments openStorage={openStorage} setOpenStorage={setOpenStorage} />
                        </div>
                        <div className={cx('learning__bar')}>
                            <h1 className={cx('learning__bar--title')}>Nội dung khóa học</h1>
                            <div className={cx('course_topic')}>
                                {course?.data?.chapters.map((item, indexChapter) => {
                                    return (
                                        <div className={cx('learning__chapter')} key={item._id}>
                                            <h3 className={cx('learning__chapter--txt')}>
                                                {++indexChapter}. {item.name}
                                            </h3>

                                            {item?.lessons.map((lesson, indexLesson) => {
                                                const lessonIndex = lessons.findIndex(
                                                    (lesson) => lesson._id === lessonId,
                                                );

                                                const currentLessonId = lessons?.[lessonIndex]?._id;
                                                const isOpenLesson = currentLessonId === lesson._id;
                                                const nextLessonIndex = lessons.findIndex(
                                                    (lesson) => !lesson?.isCompleted,
                                                );

                                                const isOpenNextLesson = lessons?.[nextLessonIndex]?._id === lesson._id;

                                                return (
                                                    <div className={cx('learning__chapter--lesson')} key={lesson._id}>
                                                        {lesson.isCompleted || isOpenLesson || isOpenNextLesson ? (
                                                            <NavLink
                                                                exact="true"
                                                                to={`/learning/${courseId}/${lesson._id}`}
                                                                className={({ isActive }) => {
                                                                    return cx(
                                                                        'block',
                                                                        'learning__chapter--lesson_name',
                                                                        isActive &&
                                                                            'learning__chapter--lesson_name_active',
                                                                    );
                                                                }}
                                                            >
                                                                <div
                                                                    className="relative"
                                                                    style={{ display: 'flex', gap: '1%' }}
                                                                >
                                                                    <div className="d-flex align-items-center gap-2 flex-wrap">
                                                                        <strong>
                                                                            {indexChapter + '.' + ++indexLesson}
                                                                        </strong>{' '}
                                                                        {lesson.name}{' '}
                                                                        {lesson.isCompleted && (
                                                                            <FontAwesomeIcon
                                                                                className={cx(
                                                                                    'learning__chapter--circle_check',
                                                                                )}
                                                                                icon={faCircleCheck}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    onClick={() => navigate(`/quizz/${lesson._id}`)}
                                                                    className={cx('learning__chapter--lesson-btn')}
                                                                >
                                                                    Bài tập
                                                                </div>
                                                            </NavLink>
                                                        ) : (
                                                            <div className={cx('lesson_lock')}>
                                                                <strong>{indexChapter + '.' + ++indexLesson}</strong>{' '}
                                                                {lesson.name}
                                                                <div>
                                                                    <p className={cx('learning__chapter--lesson-btn')}>
                                                                        Bài tập
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <div className={cx('actionBar')}>
                <button
                    className={cx('note-storage')}
                    onClick={() => {
                        setOpenStorage(true);
                    }}
                >
                    <FontAwesomeIcon className={cx('icon')} icon={faNoteSticky} />
                    <span>Ghi chú</span>
                </button>
                <div className={cx('actionBtn')}>
                    <button className={cx('pre-lesson')} onClick={() => 'handlePrev'}>
                        Bài trước
                    </button>
                    <button className={cx('next-lesson', false && 'block-lesson')} onClick={() => 'handleNext'}>
                        Bài kế tiếp
                    </button>
                </div>
                <button className={cx('btn__bar')}>
                    <FontAwesomeIcon className={cx('icon')} icon={faBars} />
                </button>
            </div>
        </div>
    );
};

export default Learning;
