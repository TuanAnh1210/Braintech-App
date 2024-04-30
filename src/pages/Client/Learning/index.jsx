import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faChevronLeft,
    faCircleCheck,
    faEllipsis,
    faNoteSticky,
    faPen,
    faTimes,
    faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Button, Spin, Table, Col, Popconfirm, Drawer, Form, Input, Row, Space } from 'antd';
import { Link, NavLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState, useCallback } from 'react';
import Highlighter from 'react-highlight-words';
import { Container } from 'react-bootstrap';
import classNames from 'classnames/bind';
import { useCookies } from 'react-cookie';
import Draggable from 'react-draggable';
import { jwtDecode } from 'jwt-decode';
import { format } from 'date-fns';
import { debounce } from 'lodash';

import { useGetDetailQuery } from '@/providers/apis/courseApi';
import {
    useGetNotebyIdClientQuery,
    useCreateNoteMutation,
    useDeleteNoteMutation,
    useUpdateNoteMutation,
} from '@/providers/apis/noteApi';
import {
    useCreateCmtMutation,
    useDeleteCmtMutation,
    useGetAllQuery,
    useUpdateCmtMutation,
} from '@/providers/apis/cmtApi';
import {
    useAddFinishLessonMutation,
    useGetCountQuery,
    useGetFinishLessonQuery,
    useGetLessonByIdQuery,
    useGetLessonQuery,
} from '@/providers/apis/lessonApi';
import { useAddSttCourseMutation } from '@/providers/apis/sttCourseApi';
import { useGetUsersQuery } from '@/providers/apis/userApi';

import VideoYoutubePlayer from '@/components/VideoPlayer/VideoYoutubePlayer';
import VideoCloudinaryPlayer from '@/components/VideoPlayer/VideoCloudinaryPlayer';

import images from '@/assets/images';

import styles from './Learning.module.scss';
const cx = classNames.bind(styles);

const Learning = () => {
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [valueNote, setValue] = useState('');
    const [idNote, setIdValue] = useState('');
    const [err, setErrNote] = useState('');
    const [searchParams] = useSearchParams();
    const idLesson = searchParams.get('id');

    const navigate = useNavigate();

    const ref = useRef(null);
    const refCmtInput = useRef(null);
    const refNoteInput = useRef(null);
    const mainView = useRef(null);
    const searchInput = useRef(null);
    const intervalRef = useRef();

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [cookies] = useCookies(['cookieLoginStudent']);

    const { data, isLoading } = useGetDetailQuery(id); // các bài học của khóa học
    const { data: allLesson } = useGetLessonQuery(); // lấy ra tất cả các khóa học để thực hiện lọc
    const { data: currentLesson, isLoading: isCurrentLessonLoading } = useGetLessonByIdQuery(idLesson, {
        skip: !idLesson,
    }); // lấy ra tất cả các khóa học để thực hiện lọc

    const [chapterId, setChapterId] = useState(null); //chỉ mục của từng phần trong khóa học
    const [cmtInput, setCmtInput] = useState(''); // nội dung của cmt
    const [path, setPath] = useState(''); // path của video
    const [isComment, setCommment] = useState(true); // đang là bình luận hay ghi chú (true false)
    const [userId, setUserId] = useState(null); // lưu id người dùng
    const [noteInput, setNoteInput] = useState(''); //nội dung của ghi chú
    const [progressVideo, setProgessVideo] = useState(0); // tiến độ video [0-100]
    const [openStorage, setOpenStorage] = useState(false);
    const [countLesson, setCountLesson] = useState(0); //đếm khóa học
    const [isModalShown, setIsModalShown] = useState(false);
    const [lessonIncome, setIncomeLesson] = useState(null);
    const [isDelete, setDelete] = useState(false);
    const [preLesson, setPreLesson] = useState(null);
    const [progressCourse, setProgessCourse] = useState(0);
    const [nextLesson, setNextLesson] = useState(null);

    const [handleAddSttCourse] = useAddSttCourseMutation();
    const [deleteCmt] = useDeleteCmtMutation();
    const [isUpdateCmt, setUpdateCmt] = useState({ update: false });

    const { data: dataFinish, isLoading: loadingFinish, refetch: refetchDataFinish } = useGetFinishLessonQuery(userId);
    const { data: countLessonFinish, refetch: refetchCount } = useGetCountQuery(id);

    const completedLesson = allLesson?.lessons?.filter((lesson) => {
        return dataFinish?.data?.some((data) => data.lesson_id === lesson._id);
    });

    const openLesson = [...(completedLesson ?? []), nextLesson];

    const isReachedLesson = completedLesson?.some((lesson) => lesson?._id === idLesson);

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
        }, 5000);
    };

    const { data: dataUser, refetch: refetchDataUser } = useGetUsersQuery(); //dữ liệu người dùng
    const { data: cmtData, isLoading: cmtLoading, isFetching: cmtFetching, refetch } = useGetAllQuery(idLesson); //lấy bình luận dựa trên id bài học
    const [handleAddCmt] = useCreateCmtMutation(); //thêm bình luận
    const [handleAddNote] = useCreateNoteMutation(); //thêm ghi chú
    const [handleDeleteNote] = useDeleteNoteMutation(); // xóa ghi chú
    const [handleUpdateNotes] = useUpdateNoteMutation(); // update ghi chú
    const [handleAddFinishLesson] = useAddFinishLessonMutation();
    const [handleUpdateCmt] = useUpdateCmtMutation();
    const { data: noteData, refetch: refetchNote } = useGetNotebyIdClientQuery(userId); // lấy tất cả các ghi chú của người dùng
    const handleClickScroll = () => {
        // thực hiện scroll
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleIsCompleted = (lesson) => {
        return completedLesson?.some((lessonCompleted) => lessonCompleted?._id === lesson?._id);
    };

    const handleIsOpen = (lesson) => {
        return openLesson?.some((lessonCompleted) => lessonCompleted?._id === lesson?._id);
    };

    const handleClickLesson = useCallback(
        debounce((path) => {
            if (path) {
                const path_video = path.split('=')[1];
                console.log(path_video);
                setPath(path_video);
            }
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
        // console.log(newNote);
        handleAddNote(newNote).then(() => {
            // gửi dữ liêu được nhập về backend
            refNoteInput.current.value = '';

            setNoteInput('');
            refetchNote();
        });
    };

    const handleLearnCourse = () => {
        const data = {
            user_id: userId,
            course_id: id,
        };
        handleAddSttCourse(data);
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    useEffect(() => {
        setIsModalShown(false);

        if (progressVideo >= 95) {
            setIsModalShown(true);
        } else if (!nextLesson && countLessonFinish?.count === countLesson) {
            setIsModalShown(false);
        }
    }, [progressVideo, isModalShown, dataFinish]);

    useEffect(() => {
        mainView.current?.scrollIntoView({ behavior: 'smooth' }); // luôn luôn view ở video
        setProgessVideo(0);
        setIsModalShown(false);

        const access_token = cookies.cookieLoginStudent;

        if (access_token !== 'null' && access_token) {
            const token = access_token.accessToken;
            if (token !== null) {
                const decode = jwtDecode(token); // dịch ngược mã jwt
                const idLog = decode?._id; // lấy id người dùng
                const idUser = dataUser?.data?.find((user) => user?._id === idLog);
                setUserId(idUser?._id);
            }
        } else {
            navigate(`/detail/${id}`);
        }
    }, [dataUser, path, cmtData, isReachedLesson, userId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newCmt = {
            content: cmtInput,
            user_id: userId,
            lesson_id: idLesson,
        };

        handleAddCmt(newCmt)
            .then(() => {
                refCmtInput.current.value = '';
                setCmtInput('');
                refetch();
            })
            .catch((error) => {
                console.error('Error adding comment:', error);
                // Handle error if necessary
            });
    };

    const handleDelete = (id) => {
        setDelete({ isDeleteCmt: true, id: id });
    };

    const handleSubmitDeleteCmt = (id) => {
        deleteCmt(id).then(() => {
            refetch();
        });
        setDelete({ isDeleteCmt: false });
    };

    const handleSubmitUpdateCmt = (e) => {
        e.preventDefault();
        const updateData = {
            content: cmtInput,
            id: isUpdateCmt._id,
        };
        handleUpdateCmt(updateData).then(() => {
            refetch();
            setUpdateCmt({ update: false });
            setCmtInput('');
        });
    };

    useEffect(() => {
        const count = data?.course?.chapters?.reduce((total, chap) => total + chap.lessons.length, 0);
        const progressDone = Math.floor((countLessonFinish?.count / count) * 100);
        setProgessCourse(progressDone);
        setCountLesson(count);
        refetchDataUser();
    }, [data, dataFinish, countLessonFinish]);

    useEffect(() => {
        if (currentLesson) {
            const pathVideo = currentLesson.url_video;
            const chapterId = data?.course.chapters.find((chapter) => {
                return chapter.lessons.some((lesson) => lesson._id === idLesson);
            });
            setChapterId(chapterId?._id);
            setPath(pathVideo);
        }
    }, [idLesson, currentLesson, data]);

    useEffect(() => {
        if (!isLoading && data && currentLesson) {
            const chapter = data?.course?.chapters?.find((chapter) => chapter?._id === chapterId);
            const chapterIndex = data?.course?.chapters?.findIndex((chapter) => chapter?._id === chapterId);

            const lessonIndex = chapter?.lessons?.findIndex((lesson) => lesson?._id === idLesson);
            if (lessonIndex !== chapter?.lessons?.length - 1) {
                const lessonIncome = chapter?.lessons.find((lesson, index) => index === lessonIndex + 1);
                setIncomeLesson(lessonIncome);
            } else {
                const lessonIncome = data?.course?.chapters[chapterIndex + 1]?.lessons.find(
                    (lesson, index) => index === 0,
                );
                setIncomeLesson(lessonIncome);
            }
        }
    }, [data, chapterId, idLesson, isLoading, currentLesson]);

    useEffect(() => {
        if (!isLoading && data && currentLesson && !loadingFinish) {
            const chapter = data?.course?.chapters?.find((chapter) => chapter?._id === chapterId);
            const chapterIndex = data?.course?.chapters?.findIndex((chapter) => chapter?._id === chapterId);

            const lessonFinishLast = dataFinish?.data[dataFinish?.data?.length - 1];
            const lessonIndex = chapter?.lessons?.findIndex(
                (lesson, index) => lesson?._id === lessonFinishLast?.lesson_id,
            );

            if (lessonIndex !== chapter?.lessons?.length - 1) {
                const lessonNext = chapter?.lessons?.find((lesson, index) => index === lessonIndex + 1);
                setNextLesson(lessonNext);
            } else {
                const lessonNext = data?.course?.chapters[chapterIndex + 1]?.lessons?.find(
                    (lesson, index) => index === 0,
                );
                setNextLesson(lessonNext);
            }
        }
    }, [data, chapterId, idLesson, isLoading, currentLesson, dataFinish, loadingFinish]);

    useEffect(() => {
        if (!isLoading && data && currentLesson && chapterId) {
            const chapter = data?.course?.chapters?.find((chapter) => chapter?._id === chapterId);
            const chapterIndex = data?.course?.chapters?.findIndex((chapter) => chapter?._id === chapterId);
            const lessonIndex = chapter?.lessons.findIndex((lesson) => lesson._id === idLesson);
            if (lessonIndex > 0) {
                const prevLesson = chapter?.lessons[lessonIndex - 1];
                setPreLesson(prevLesson);
            } else {
                const prevLesson = data?.course?.chapters[chapterIndex - 1]?.lessons[chapter.lessons.length - 1];
                setPreLesson(prevLesson);
            }
        }
    }, [data, chapterId, idLesson, isLoading, currentLesson]);

    const handleNext = useCallback(
        debounce(() => {
            if (lessonIncome) {
                navigate(`/learning/${id}?id=${lessonIncome._id}`);
            }
        }, 500),
        [navigate, lessonIncome, id],
    );

    const handlePrev = useCallback(
        debounce(() => {
            if (preLesson) {
                navigate(`/learning/${id}?id=${preLesson._id}`);
            }
        }, 500),
        [navigate, preLesson, id],
    );

    const { logo } = images;

    const handleSetFinish = () => {
        const dataToSend = {
            lesson_id: idLesson,
            user_id: userId,
            course_id: id,
        };
        setProgessVideo(0);
        clearInterval(intervalRef.current);
        handleAddFinishLesson(dataToSend).then(() => {
            handleNext();
            refetchDataFinish();
            refetchCount();
        });
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },

        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const listNote = noteData?.data?.map((item) => {
        const currentDate = item.updatedAt;
        const formattedDate = format(currentDate, 'dd/MM/yyyy');
        const formattedTime = format(currentDate, 'HH:mm:ss');

        return {
            idTest: item._id,
            name: currentLesson?.name,
            note: item.text,
            createdate: `${formattedDate}  - ${formattedTime}`,
        };
    });

    const onDelete = (x) => {
        handleDeleteNote(x).then(() => {
            refNoteInput.current.value = '';
            refetchNote();
        });
    };

    const showDrawer = async (x) => {
        const a = await noteData?.data?.find((item) => item._id === x);
        setValue(a.text);
        setIdValue(a._id);
        setErrNote('');
        setOpen(true);
    };

    const handleTextareaChange = async (event) => {
        const textChange = await event.target.value;
        setValue(textChange);
    };

    const columns = [
        {
            title: 'Tên bài học',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Nội dung ghi chú',
            dataIndex: 'note',
            key: 'note',
            width: '30%',
            ...getColumnSearchProps('note'),
        },
        {
            title: 'Ngày - Giờ',
            dataIndex: 'createdate',
            key: 'createdate',
            width: '30%',
            ...getColumnSearchProps('createdate'),
        },
        {
            title: 'Action',
            dataIndex: 'idTest',
            width: '25%',
            key: 'idTest',

            render: (abc) => (
                <div className="flex gap-[5px]">
                    <>
                        <Button type="primary" onClick={() => showDrawer(abc)}>
                            Sửa
                        </Button>
                        <Drawer
                            title=""
                            width={500}
                            onClose={onClose}
                            open={open}
                            styles={{
                                body: {
                                    paddingBottom: 80,
                                },
                            }}
                        >
                            <Form layout="vertical" onFinish={onNote} autoComplete="off">
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <Form.Item name="text" label="Nội dung">
                                            <Input.TextArea
                                                value={valueNote}
                                                onChange={handleTextareaChange}
                                                ref={refNoteInput}
                                            />
                                            <Button type="primary" htmlType="submit" className="mt-[10px]">
                                                Submit
                                            </Button>
                                        </Form.Item>
                                        <span className="text-red-500" ref={refNoteInput}>
                                            {err}
                                        </span>
                                    </Col>
                                </Row>
                            </Form>
                        </Drawer>
                    </>
                    <Popconfirm
                        title="Xóa ghi chú"
                        description="Bạn chắc chắn muốn xóa không?"
                        //onCancel={onClose}
                        onConfirm={() => onDelete(abc)}
                        ref={refNoteInput}
                        icon={
                            <QuestionCircleOutlined
                                style={{
                                    color: 'red',
                                }}
                            />
                        }
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const onNote = () => {
        const a = noteData?.data?.find((item) => item._id === idNote);
        if (valueNote.trim() === '') {
            setErrNote('Vui lòng nhập nội dung ghi chú');
            return;
        }
        const updateNote = {
            ...a,
            _id: idNote,
            text: valueNote,
            updatedAt: new Date(),
        };

        handleUpdateNotes(updateNote).then(() => {
            refNoteInput.current.value = '';
            refetchNote();
        });
        setValue('');
        setOpen(false);
    };
    const onClose = () => {
        setOpen(false);
    };

    if (isCurrentLessonLoading) return <Spin fullscreen />;

    return (
        <div className="main">
            <header className={cx('header')}>
                {isModalShown && (
                    <Draggable>
                        <div className={cx('message__delete')}>
                            <h2>Bạn đã hoàn thành bài học này!!</h2>
                            <h4>
                                Nhấn {`"Yes"`} để {isReachedLesson ? 'chuyển bài' : 'mở khóa'} nhé
                            </h4>
                            <div className={cx('btn__delete-container')}>
                                <button onClick={handleSetFinish} className={cx('yes')}>
                                    Yes
                                </button>
                            </div>
                        </div>
                    </Draggable>
                )}
                {isDelete.isDeleteCmt === true ? (
                    <Draggable>
                        <div className={cx('message__delete')}>
                            <h2>Bạn muốn xóa bình luận này chứ!!</h2>
                            <h4>Nhấn yes để xóa nhé</h4>
                            <div className={cx('btn__delete-container')}>
                                <button className={cx('yes')} onClick={() => handleSubmitDeleteCmt(isDelete.id)}>
                                    Yes
                                </button>
                                <button className={cx('yes')} onClick={() => setDelete(false)}>
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </Draggable>
                ) : (
                    <></>
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
                                    <p>{data?.course?.name}</p>
                                </Link>
                            </div>
                        </div>
                        <div className={cx('header__actions')}>
                            <div className={cx('header__progress')}>
                                <p className={cx('header__progress--txt')}>
                                    Tiến độ: &emsp;
                                    <span className="progress_learned">{countLessonFinish?.count}</span>/
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
                                {countLessonFinish?.count === countLesson && !isLoading ? (
                                    <Link
                                        onClick={handleLearnCourse}
                                        className={cx('header__cert--link')}
                                        to={`/certificate/${id}`}
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
                                {currentLesson.source_type === 'youtube' ? (
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
                                                    value={cmtInput}
                                                />
                                                <button className={cx('send__comment')}>Gửi bình luận</button>
                                            </form>
                                        </div>

                                        <div className={cx('comment_wrapper-content')}>
                                            {cmtLoading & cmtFetching ? (
                                                <>Loading...</>
                                            ) : cmtData && cmtData.data ? (
                                                cmtData.data.map((cmt) => {
                                                    const user = dataUser?.data?.find((data) => {
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
                                                                {isUpdateCmt.update === true ? (
                                                                    <form
                                                                        className={cx('update_cmt_form')}
                                                                        onSubmit={handleSubmitUpdateCmt}
                                                                    >
                                                                        <input
                                                                            className={cx('contentUpdateIpt')}
                                                                            type="text"
                                                                            value={cmtInput}
                                                                            name="contentUpdateIpt"
                                                                            ref={refCmtInput}
                                                                            onChange={(e) => {
                                                                                setCmtInput(e.target.value);
                                                                            }}
                                                                        />
                                                                        <button>Cập nhật</button>
                                                                    </form>
                                                                ) : (
                                                                    ''
                                                                )}

                                                                {user?._id == userId && (
                                                                    <div className={cx('comments-options')}>
                                                                        <FontAwesomeIcon icon={faEllipsis} />
                                                                        <div className={cx('options-sub')}>
                                                                            <p
                                                                                className={cx('btn_option-cmt')}
                                                                                onClick={() => {
                                                                                    setUpdateCmt({
                                                                                        update: true,
                                                                                        ...cmt,
                                                                                    });
                                                                                    setCmtInput(cmt.text);
                                                                                }}
                                                                            >
                                                                                Sửa&emsp;
                                                                                <FontAwesomeIcon
                                                                                    className={cx('icon')}
                                                                                    icon={faPen}
                                                                                />
                                                                            </p>

                                                                            <p
                                                                                className={cx('btn_option-cmt')}
                                                                                onClick={() => {
                                                                                    handleDelete(cmt._id);
                                                                                }}
                                                                            >
                                                                                Xóa&emsp;
                                                                                <FontAwesomeIcon
                                                                                    className={cx('icon')}
                                                                                    icon={faTrash}
                                                                                />
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )}
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
                                                    cols="10"
                                                    rows="3"
                                                    ref={refNoteInput}
                                                    onChange={(e) => {
                                                        setNoteInput(e.target.value);
                                                    }}
                                                    value={noteInput}
                                                />
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
                                {data?.course?.chapters.map((item, indexChapter) => {
                                    return (
                                        <div className={cx('learning__chapter')} key={item._id}>
                                            <h3 className={cx('learning__chapter--txt')}>
                                                {++indexChapter}. {item.name}
                                            </h3>

                                            {item?.lessons.map((lesson, indexLesson) => {
                                                const checkDone = handleIsCompleted(lesson);
                                                const isOpen = handleIsOpen(lesson);

                                                return (
                                                    <div className={cx('learning__chapter--lesson')} key={lesson._id}>
                                                        {checkDone || isOpen || path === lesson.url_video ? (
                                                            <NavLink
                                                                exact
                                                                to={`/learning/${id}?id=${lesson._id}`}
                                                                onClick={() => handleClickLesson(lesson.url_video)}
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
                                                                    <p className="d-flex align-items-center gap-1 flex-wrap">
                                                                        <strong>
                                                                            {indexChapter + '.' + ++indexLesson}
                                                                        </strong>{' '}
                                                                        {lesson.name}{' '}
                                                                        {checkDone && (
                                                                            <FontAwesomeIcon
                                                                                className={cx(
                                                                                    'learning__chapter--circle_check',
                                                                                )}
                                                                                icon={faCircleCheck}
                                                                            />
                                                                        )}
                                                                    </p>
                                                                </div>
                                                                <Link
                                                                    to={`/quizz/${lesson._id}`}
                                                                    className={cx('learning__chapter--lesson-btn')}
                                                                >
                                                                    Bài tập
                                                                </Link>
                                                            </NavLink>
                                                        ) : (
                                                            <div>
                                                                <p className={cx('lesson_lock')}>
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
                            </div>
                            <div className={cx('note_list')}>
                                <Table
                                    columns={columns}
                                    dataSource={listNote}
                                    pagination={{
                                        pageSize: 50,
                                    }}
                                    scroll={{
                                        y: 340,
                                    }}
                                />
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
