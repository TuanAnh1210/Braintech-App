import classNames from 'classnames/bind';
import styles from './Learning.module.scss';
import { Button, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronLeft, faEllipsis, faNoteSticky, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import images from '@/assets/images';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetDetailQuery } from '@/providers/apis/courseApi';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);
const Learning = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isFetching, isError } = useGetDetailQuery(id);
    const [chapterIndex, setChapterIndex] = useState(0);
    const [lessonIndex, setLessonIndex] = useState(0);
    const [path, setPath] = useState('');

    useEffect(() => {
        if (data && data.courses && data.courses.chapters && data.courses.chapters.length > 0) {
            const chapter = data.courses.chapters[chapterIndex];
            const lesson = chapter?.lessons[lessonIndex];
            if (lesson) {
                setPath(lesson.path_video);
            } else {
                if (chapterIndex < data.courses.chapters.length - 1) {
                    setChapterIndex(chapterIndex + 1);
                    setLessonIndex(0);
                }
            }
        }
    }, [data, chapterIndex, lessonIndex]);
    const handleNext = () => {
        const chapter = data?.courses?.chapters[chapterIndex];
        if (lessonIndex < chapter?.lessons.length - 1) {
            setLessonIndex(lessonIndex + 1);
        } else {
            if (chapterIndex < data?.courses?.chapters.length - 1) {
                setChapterIndex(chapterIndex + 1);
                setLessonIndex(0);
            }
        }
    };

    const handlePrev = () => {
        if (lessonIndex > 0) {
            setLessonIndex(lessonIndex - 1);
        } else {
            if (chapterIndex > 0) {
                setChapterIndex(chapterIndex - 1);
                const prevChapter = data?.courses?.chapters[chapterIndex];
                setLessonIndex(prevChapter.lessons.length - 1);
            }
        }
    };
    const { logo } = images;

    return (
        <div className="main">
            <header className={cx('header')}>
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
                                    Tiến độ: &emsp;<span className="progress_learned">2</span>/
                                    <span className="progress_lesson">8</span>
                                </p>
                                <div className="progress">
                                    <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: '100%' }}
                                        aria-valuenow="100"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        100%
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
                        <div className={cx('learning__video')}>
                            <div id="player">
                                <iframe
                                    width="100%"
                                    height="515"
                                    src={`https://www.youtube.com/embed/${path}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowfullscreen
                                ></iframe>
                            </div>

                            <div className={cx('comment__wrapper')}>
                                <div className={cx('commment__option')}>
                                    <button className="commment__option-btn active">Bình luận</button>
                                    <button className="note__option-btn ">Ghi chú</button>
                                </div>

                                <div className="commentZone open">
                                    <div className={cx('commentBox')}>
                                        <img
                                            className={cx('commentBox--img')}
                                            src="https://yt3.ggpht.com/UsflU74uvka_3sejOu3LUGwzOhHJV0eIYoWcvOfkOre_c12uIN4ys-QqRlAkbusEmbZjTA-b=s88-c-k-c0x00ffffff-no-rj"
                                            alt=""
                                        />

                                        <form className={cx('form__comment')}>
                                            <input hidden type="text" name="cmt_idUser" value="" />

                                            <textarea
                                                required
                                                className={cx('commentBox--ipt')}
                                                name="cmt_content"
                                                id=""
                                                placeholder="Gửi bình luận của bạn"
                                            ></textarea>
                                            <button className={cx('send__comment')}>Gửi bình luận</button>
                                        </form>
                                    </div>

                                    <div className={cx('comment_wrapper-content')}>
                                        <div className={cx('commentBox', 'noMt')}>
                                            <img
                                                className={cx('commentBox--img')}
                                                src="https://yt3.ggpht.com/UsflU74uvka_3sejOu3LUGwzOhHJV0eIYoWcvOfkOre_c12uIN4ys-QqRlAkbusEmbZjTA-b=s88-c-k-c0x00ffffff-no-rj"
                                                alt=""
                                            />

                                            <div className={cx('commentBox--right')}>
                                                <h5>
                                                    Tuan Anh <span className={cx('comment__time')}>12-10-2003</span>
                                                </h5>
                                                <p className={cx('commentBox--text')}>gfg</p>
                                                <form className={cx('update_cmt_form')}>
                                                    <input hidden type="text" name="cmt_idUser" value="" />

                                                    <input
                                                        className="contentUpdateIpt"
                                                        type="text"
                                                        value=""
                                                        name="contentUpdateIpt"
                                                    />
                                                    <button>Cập nhật</button>
                                                </form>
                                                <div className={cx('comments-options')}>
                                                    <FontAwesomeIcon icon={faEllipsis} />
                                                    <div className={cx('options-sub')}>
                                                        <p className={cx('btn_option-cmt')}>
                                                            Sửa&emsp;
                                                            <FontAwesomeIcon className={cx('icon')} icon={faPen} />
                                                        </p>

                                                        <p
                                                            data-idCourse="<?= $id_course ?>"
                                                            data-idLesson="<?= $id_lesson ?>"
                                                            data-idCmt=""
                                                            className={cx('btn_option-cmt')}
                                                        >
                                                            Xóa&emsp;
                                                            <FontAwesomeIcon className={cx('icon')} icon={faTrash} />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div hidden className="noteZone">
                                    <form className="noteForm">
                                        <h2 className="note--title">
                                            Thêm ghi chú tại <span className="note--time">bài học này</span>
                                        </h2>
                                        <input hidden type="text" value="<?= $id_lesson ?>" name="id_lesson" />

                                        <div className="form__group">
                                            <label>Nội dung ghi chú:</label>
                                            <textarea
                                                required
                                                placeholder="Nội dung ghi chú..."
                                                className="note--ipt"
                                                name="note_content"
                                                id=""
                                                cols="30"
                                                rows="10"
                                            ></textarea>
                                        </div>

                                        <button className="send__comment">Thêm ghi chú</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className={cx('learning__bar')}>
                            <h1 className={cx('learning__bar--title')}>Nội dung khóa học</h1>
                            <div className={cx('course_topic')}>
                                {data?.courses?.chapters.map((item, index) => {
                                    return (
                                        <div className={cx('learning__chapter')} key={item.id}>
                                            <h3 className={cx('learning__chapter--txt')}>
                                                {++index}.{item.name}
                                            </h3>

                                            {item?.lessons.map((lesson, indexLesson) => {
                                                return (
                                                    <div className={cx('learning__chapter--lesson')} key={lesson.id}>
                                                        <div
                                                            onClick={() => {
                                                                setPath(lesson.path_video);
                                                                setLessonIndex(indexLesson);
                                                                setChapterIndex(index - 1);
                                                            }}
                                                        >
                                                            <p
                                                                className={cx(
                                                                    path === lesson.path_video
                                                                        ? 'learning__chapter--lesson_name_active'
                                                                        : 'learning__chapter--lesson_name',
                                                                )}
                                                            >
                                                                {lesson.name}
                                                            </p>
                                                        </div>
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
                <button className={cx('note-storage')}>
                    <FontAwesomeIcon className={cx('icon')} icon={faNoteSticky} />
                    <span>Ghi chú</span>
                </button>
                <div className={cx('actionBtn')}>
                    <button className={cx('pre-lesson')} onClick={handlePrev}>
                        Bài trước
                    </button>
                    <button className={cx('next-lesson')} onClick={handleNext}>
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
