import classNames from 'classnames/bind';
import styles from './Learning.module.scss';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce } from 'lodash';

import {
    faBars,
    faCaretDown,
    faChevronLeft,
    faEllipsis,
    faNoteSticky,
    faPen,
    faTimes,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import YouTube from 'react-youtube';
import images from '@/assets/images';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useGetDetailQuery } from '@/providers/apis/courseApi';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useGetUsersQuery } from '@/providers/apis/userApi';
import { useCreateCmtMutation, useGetAllQuery } from '@/providers/apis/cmtApi';
import { useCreateNoteMutation, useGetNotebyIdClientQuery } from '@/providers/apis/noteApi';
import { useAddFinishLessonMutation, useGetFinishLessonQuery, useGetLessonQuery } from '@/providers/apis/lessonApi';
import { useCallback } from 'react';
import Draggable from 'react-draggable';

const cx = classNames.bind(styles);
const Learning = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const ref = useRef(null);
    const refCmtInput = useRef(null);
    const refNoteInput = useRef(null);
    const mainView = useRef(null);
    const { data } = useGetDetailQuery(id); // các bài học của khóa học
    const { data: allLesson } = useGetLessonQuery(); // lấy ra tất cả các khóa học để thực hiện lọc
    const [chapterIndex, setChapterIndex] = useState(0); //chỉ mục của từng phần trong khóa học
    const [lessonIndex, setLessonIndex] = useState(0); // chỉ mục của từng bài học trong từng phần
    const [cmtInput, setCmtInput] = useState(''); // nội dung của cmt
    const [path, setPath] = useState(''); // path của video
    const [isComment, setCommment] = useState(true); // đang là bình luận hay ghi chú (true false)
    const [userId, setUserId] = useState(null); // lưu id người dùng
    const [idLesson, setIdLesson] = useState(null); // lưu id khóa học
    const [noteInput, setNoteInput] = useState(''); //nội dung của ghi chú
    const [progressVideo, setProgessVideo] = useState(0); // tiến độ video [0-100]
    const [openStorage, setOpenStorage] = useState(false);
    const [countLesson, setCountLesson] = useState(0); //đếm khóa học
    const [isModalShown, setIsModalShown] = useState(false);
    const [progressCourse, setProgessCourse] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const intervalRef = useRef();
    const { data: dataFinish, refetch: refetchDataFinish } = useGetFinishLessonQuery(userId);
    const countFinishLesson = dataFinish?.data.length;

    const completedLesson = allLesson?.lessons?.filter((lesson) => {
        return dataFinish?.data?.some((data) => data.lesson_id === lesson._id);
    });
    const isReachedLesson = completedLesson?.some((lesson) => lesson._id === idLesson);
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
        }, 1000);
    };
    const opts = {
        //cấu hình thẻ Youtube
        height: '515',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 0,
        },
    };

    const dataUser = useGetUsersQuery(); //dữ liệu người dùng
    const { data: cmtData, isLoading: cmtLoading, isFetching: cmtFetching, refetch } = useGetAllQuery(idLesson); //lấy bình luận dựa trên id bài học
    const [handleAddCmt] = useCreateCmtMutation(); //thêm bình luận
    const [handleAddNote] = useCreateNoteMutation(); //thêm ghi chú
    const [handleAddFinishLesson] = useAddFinishLessonMutation();
    const { data: noteData, refetch: refetchNote } = useGetNotebyIdClientQuery(userId); // lấy tất cả các ghi chú của người dùng
    const handleClickScroll = () => {
        // thực hiện scroll
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };
    const handleIsCompleted = (lesson) => {
        return completedLesson?.some((lessonCompleted) => lessonCompleted._id === lesson._id);
    };
    const handleClickLesson = useCallback(
        debounce((path, indexLesson, chapterLeson) => {
            setPath(path);
            setLessonIndex(indexLesson - 1);
            setChapterIndex(chapterLeson - 1);
            setIsModalShown(false);
        }, 500),
        [],
    );
    const handleSubmitNote = (e) => {
        e.preventDefault();
        const newNote = {
            content: noteInput,
            user_id: userId,
            lesson_id: idLesson,
        };
        handleAddNote(newNote).then(() => {
            // gửi dữ liêu được nhập về backend
            refNoteInput.current.value = '';

            setNoteInput('');
            refetchNote();
        });
    };

    useEffect(() => {
        setIsModalShown(false);
        if (progressVideo >= 90) {
            setIsModalShown(true);
        } else if (isModalShown) {
            setIsModalShown(false);
        }
    }, [progressVideo, isModalShown]);
    useEffect(() => {
        mainView.current?.scrollIntoView({ behavior: 'smooth' }); // luôn luôn view ở video
        const lesson = data?.courses?.chapters[chapterIndex]?.lessons[lessonIndex]?._id; // lấy id của bài học dựa theo index của các chapters?
        setIdLesson(lesson);
        setIsModalShown(false);
        const { token } = JSON.parse(localStorage.getItem('access_token')); //lấy token được lưu khi người dùng đăng nhập
        const decode = jwtDecode(token); // dịch ngược mã jwt
        const idLog = decode.data._id; // lấy id người dùng
        const idUser = dataUser?.data?.data?.find((user) => user._id === idLog);
        setUserId(idUser?._id);
    }, [dataUser, path, lessonIndex, chapterIndex, cmtData, isReachedLesson]);
    const debouncedHandleAddCmt = useCallback(debounce(handleAddCmt, 1000), []); //thực hiện debounce để giảm tải cho server
    const handleSubmit = (e) => {
        e.preventDefault();

        const newCmt = {
            content: cmtInput,
            user_id: userId,
            lesson_id: idLesson,
        };
        debouncedHandleAddCmt(newCmt).then(() => {
            refCmtInput.current.value = '';
            setCmtInput('');
            refetch();
        });
    };
    useEffect(() => {
        const count = data?.courses?.chapters?.reduce((total, chap) => total + chap.lessons.length, 0);
        const progressDone = Math.floor((countFinishLesson / count) * 100);
        setProgessCourse(progressDone);
        setCountLesson(count);
    }, [data, dataFinish]);
    const getLesson = (data, chapterIndex, lessonIndex) => {
        const chapter = data.courses.chapters[chapterIndex]; // lấy chapter với index đã đặt

        return chapter?.lessons[lessonIndex]; // lấy bài học trong đó
    };
    useEffect(() => {
        if (data && data.courses && data.courses.chapters && data.courses.chapters.length > 0) {
            //kiểm tra nếu có dữ liệu
            const lesson = getLesson(data, chapterIndex, lessonIndex);
            if (lesson) {
                setPath(lesson.path_video); //set path_video của bài học đó
            } else {
                if (chapterIndex < data.courses.chapters.length - 1) {
                    //nếu không tồn tại lesson thì kiểm tra xem còn bài học không
                    setChapterIndex(chapterIndex + 1); // tăng chapterIndex lên 1
                    setLessonIndex(0); // đặt lesson id về 0
                }
            }
        }
    }, [data, path, chapterIndex, lessonIndex, cmtData, isReachedLesson]);
    const handleNext = useCallback(
        debounce(() => {
            const chapter = data?.courses?.chapters[chapterIndex];
            if (lessonIndex < chapter?.lessons.length - 1) {
                setLessonIndex(lessonIndex + 1);
            } else {
                if (chapterIndex < data?.courses?.chapters.length - 1) {
                    setChapterIndex(chapterIndex + 1);
                    setLessonIndex(0);
                }
            }
        }, 500),
        [chapterIndex, lessonIndex, data],
    );

    const handlePrev = useCallback(
        debounce(() => {
            if (lessonIndex > 0) {
                setLessonIndex(lessonIndex - 1);
            } else {
                if (chapterIndex > 0) {
                    setChapterIndex(chapterIndex - 1);
                    const prevChapter = data?.courses?.chapters[chapterIndex - 1];
                    setLessonIndex(prevChapter.lessons.length - 1 || prevChapter.lessons.length);
                }
            }
        }, 500),
        [chapterIndex, lessonIndex, data],
    );
    const { logo } = images;
    const handleSetFinish = () => {
        const dataToSend = {
            lesson_id: idLesson,
            user_id: userId,
        };

        handleAddFinishLesson(dataToSend).then(() => {
            handleNext();
            setIsModalShown(false);
            refetchDataFinish();
        });
    };
    return (
        <div className="main">
            <header className={cx('header')}>
                {isModalShown && (
                    <>
                        <Draggable>
                            <div className={cx('message__delete')}>
                                <h2>Bạn đã hoàn thành bài học này!!</h2>
                                <h4>Nhấn yes để {isReachedLesson ? 'chuyển bài' : 'mở khóa'} nhé</h4>
                                <div className={cx('btn__delete-container')}>
                                    <button onClick={handleSetFinish} className={cx('yes')}>
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </Draggable>
                    </>
                )}

                <Container fluid style={{ height: '100%' }}>
                    <div className={cx('header__wrapper')}>
                        <div className={cx('header--left')}>
                            <div className={cx('header__back')}>
                                <button
                                    className={cx('button__back btn btn-outline-primary')}
                                    onClick={() => navigate(`/detail/${id}`)}
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                            </div>
                            <div className={cx('header__logo')}>
                                <Link to="/">
                                    <img src={logo} alt="" />
                                    <p>{data?.courses?.name}</p>
                                </Link>
                            </div>
                        </div>
                        <div className={cx('header__actions')}>
                            <div className={cx('header__progress')}>
                                <p className={cx('header__progress--txt')}>
                                    Tiến độ: &emsp;<span className="progress_learned">{countFinishLesson}</span>/
                                    <span className="progress_lesson">{countLesson}</span>
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
                                <a className={cx('header__cert--link')} href="">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        data-toggle="tooltip"
                                        data-placement="bottom"
                                        title="Hoàn thành hết các bài học bạn sẽ nhận được chứng chỉ"
                                    >
                                        Nhận chứng chỉ
                                    </button>
                                </a>
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
                                <Suspense fallback={<div>Loading...</div>}>
                                    {path && (
                                        <YouTube
                                            opts={opts}
                                            style={{
                                                width: '100%',
                                                height: '515px',
                                                maxWidth: 'none',
                                                maxHeight: 'none',
                                            }}
                                            videoId={`${path}`}
                                            onReady={handleGetTime}
                                        />
                                    )}
                                </Suspense>
                            </div>

                            <div className={cx('comment__wrapper')}>
                                <div className={cx('commment__option')} ref={ref}>
                                    <button
                                        className="commment__option-btn active"
                                        onClick={() => {
                                            setCommment(true);
                                            handleClickScroll();
                                        }}
                                    >
                                        Bình luận
                                    </button>
                                    <button
                                        className="note__option-btn "
                                        onClick={() => {
                                            setCommment(false);
                                            handleClickScroll();
                                        }}
                                    >
                                        Ghi chú
                                    </button>
                                </div>

                                {isComment ? (
                                    <div className="commentZone">
                                        <div className={cx('commentBox')}>
                                            <img
                                                className={cx('commentBox--img')}
                                                src="https://yt3.ggpht.com/UsflU74uvka_3sejOu3LUGwzOhHJV0eIYoWcvOfkOre_c12uIN4ys-QqRlAkbusEmbZjTA-b=s88-c-k-c0x00ffffff-no-rj"
                                                alt=""
                                            />

                                            <form className={cx('form__comment')} onSubmit={handleSubmit}>
                                                <label>Bình luận của bạn : </label>
                                                <textarea
                                                    required
                                                    className={cx('commentBox--ipt')}
                                                    name="cmt_content"
                                                    id=""
                                                    placeholder="Gửi bình luận của bạn"
                                                    ref={refCmtInput}
                                                    onChange={(e) => {
                                                        setCmtInput(e.target.value);
                                                    }}
                                                >
                                                    {cmtInput}
                                                </textarea>
                                                <button className={cx('send__comment')}>Gửi bình luận</button>
                                            </form>
                                        </div>

                                        <div className={cx('comment_wrapper-content')}>
                                            {cmtLoading & cmtFetching ? (
                                                <>Loading...</>
                                            ) : cmtData && cmtData.data ? (
                                                cmtData.data.map((cmt) => {
                                                    const user = dataUser?.data?.data?.find((data) => {
                                                        return data._id === cmt.user_id;
                                                    });
                                                    return (
                                                        <div className={cx('commentBox', 'noMt')} key={cmt._id}>
                                                            <img
                                                                className={cx('commentBox--img')}
                                                                src="https://yt3.ggpht.com/UsflU74uvka_3sejOu3LUGwzOhHJV0eIYoWcvOfkOre_c12uIN4ys-QqRlAkbusEmbZjTA-b=s88-c-k-c0x00ffffff-no-rj"
                                                                alt=""
                                                            />

                                                            <div className={cx('commentBox--right')}>
                                                                <h5>
                                                                    {user?.full_name ? user?.full_name : user?.email}
                                                                </h5>
                                                                <p className={cx('commentBox--text')}>{cmt.text}</p>
                                                                <form className={cx('update_cmt_form')}>
                                                                    <input
                                                                        hidden
                                                                        type="text"
                                                                        name="cmt_idUser"
                                                                        defaultValue=""
                                                                    />

                                                                    <input
                                                                        className="contentUpdateIpt"
                                                                        type="text"
                                                                        defaultValue=""
                                                                        name="contentUpdateIpt"
                                                                    />
                                                                    <button>Cập nhật</button>
                                                                </form>
                                                                <div className={cx('comments-options')}>
                                                                    <FontAwesomeIcon icon={faEllipsis} />
                                                                    <div className={cx('options-sub')}>
                                                                        <p className={cx('btn_option-cmt')}>
                                                                            Sửa&emsp;
                                                                            <FontAwesomeIcon
                                                                                className={cx('icon')}
                                                                                icon={faPen}
                                                                            />
                                                                        </p>

                                                                        <p className={cx('btn_option-cmt')}>
                                                                            Xóa&emsp;
                                                                            <FontAwesomeIcon
                                                                                className={cx('icon')}
                                                                                icon={faTrash}
                                                                            />
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <>No data available</>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className={cx('noteZone')}>
                                        <form className={cx('noteForm')} onSubmit={handleSubmitNote}>
                                            <h2 className={cx('note--title')}>
                                                Thêm ghi chú tại <span className={cx('note--time')}>bài học này</span>
                                            </h2>

                                            <div className="form__group">
                                                <textarea
                                                    required
                                                    placeholder="Nội dung ghi chú..."
                                                    className={cx('note--ipt')}
                                                    name="note_content"
                                                    id=""
                                                    cols="30"
                                                    rows="10"
                                                    ref={refNoteInput}
                                                    onChange={(e) => {
                                                        setNoteInput(e.target.value);
                                                    }}
                                                >
                                                    {noteInput}
                                                </textarea>
                                            </div>

                                            <button className={cx('send__comment')}>Thêm ghi chú</button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={cx('learning__bar')}>
                            <h1 className={cx('learning__bar--title')}>Nội dung khóa học</h1>
                            <div className={cx('course_topic')}>
                                {data?.courses?.chapters.map((item, indexChapter) => {
                                    return (
                                        <div className={cx('learning__chapter')} key={item.id}>
                                            <h3 className={cx('learning__chapter--txt')}>
                                                {++indexChapter}.{item.name}
                                            </h3>

                                            {item?.lessons.map((lesson, indexLesson) => {
                                                const checkDone = handleIsCompleted(lesson);

                                                return (
                                                    <div className={cx('learning__chapter--lesson')} key={lesson.id}>
                                                        {checkDone || path === lesson.path_video ? (
                                                            <div
                                                                onClick={() => {
                                                                    handleClickLesson(
                                                                        lesson.path_video,
                                                                        indexLesson,
                                                                        indexChapter,
                                                                    );
                                                                }}
                                                            >
                                                                <p
                                                                    className={cx(
                                                                        path === lesson.path_video
                                                                            ? 'learning__chapter--lesson_name_active'
                                                                            : 'learning__chapter--lesson_name',
                                                                    )}
                                                                >
                                                                    <strong>
                                                                        {indexChapter + '.' + ++indexLesson}
                                                                    </strong>{' '}
                                                                    {lesson.name}{' '}
                                                                    {checkDone ? (
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            x="0px"
                                                                            y="0px"
                                                                            width="20"
                                                                            height="20"
                                                                            viewBox="0 0 48 48"
                                                                        >
                                                                            <path
                                                                                fill="#c8e6c9"
                                                                                d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                                                                            ></path>
                                                                            <path
                                                                                fill="#4caf50"
                                                                                d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"
                                                                            ></path>
                                                                        </svg>
                                                                    ) : (
                                                                        ''
                                                                    )}
                                                                    <div className="">
                                                                        <Link
                                                                            to={`/quizz/${lesson._id}`}
                                                                            className={cx(
                                                                                'learning__chapter--lesson-btn',
                                                                            )}
                                                                        >
                                                                            Bài tập
                                                                        </Link>
                                                                    </div>
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <p className={cx('learning__chapter--lesson_name')}>
                                                                    <strong>
                                                                        {indexChapter + '.' + ++indexLesson}
                                                                    </strong>{' '}
                                                                    {lesson.name}
                                                                    <div className="">
                                                                        <p
                                                                            className={cx(
                                                                                'learning__chapter--lesson-btn',
                                                                            )}
                                                                        >
                                                                            Bài tập
                                                                        </p>
                                                                    </div>
                                                                </p>
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
                    <button className={cx('pre-lesson')} onClick={handlePrev}>
                        Bài trước
                    </button>
                    {isReachedLesson ? (
                        <button className={cx('next-lesson')} onClick={handleNext}>
                            Bài kế tiếp
                        </button>
                    ) : (
                        <button className={cx('block-lesson')}>Bài kế tiếp</button>
                    )}
                </div>
                <button className={cx('btn__bar')}>
                    <FontAwesomeIcon className={cx('icon')} icon={faBars} />
                </button>
            </div>
            {openStorage ? (
                <>
                    <div className={cx('modal')}>
                        <div className={cx('note_wrapper')}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
                                <span className={cx('note-close')} onClick={() => setOpenStorage(false)}>
                                    <button className={cx('btn__bar')}>
                                        <FontAwesomeIcon className={cx('icon')} icon={faTimes} />
                                    </button>
                                </span>
                            </div>
                            <div className={cx('note_heading')}>
                                <h2>Ghi chú của tôi</h2>
                                <select name="" id="note-wrapper-select">
                                    <option value="all" data-note="all" className={cx('note-option')}>
                                        -----Tất cả-----
                                    </option>
                                    <option value="only" data-note="only" className={cx('note-option')}>
                                        -----Trong bài học này-----
                                    </option>
                                </select>
                            </div>
                            <div className={cx('note_list')}>
                                {noteData?.data?.map((item) => {
                                    const { lessons } = allLesson;
                                    const lessonName = lessons.find((l) => l._id === item.lesson_id);
                                    return (
                                        <div className={cx('note_item')}>
                                            <div className={cx('note_item-heading')}>
                                                <p>Bài: {lessonName.name}</p>
                                                <span style={{ fontSize: '14px' }}>Nội dung:</span>
                                            </div>
                                            <div className={cx('note_item-content')}>
                                                <p className={cx('content_note')}>{item.text}</p>
                                            </div>
                                            <div className={cx('comments-options')}>
                                                <FontAwesomeIcon className={cx('icon')} icon={faCaretDown} />
                                                <div className={cx('options-sub')}>
                                                    <p className={cx('btn_option-cmt updateCmt-btn')}>Sửa</p>

                                                    <p className={cx('btn_option-cmt deleteNote-btn')}>Xóa</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                ''
            )}
        </div>
    );
};

export default Learning;
