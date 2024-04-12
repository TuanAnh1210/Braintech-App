import classNames from 'classnames/bind';
import styles from './Learning.module.scss';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { debounce } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Popconfirm, Col, DatePicker, Drawer, Form, Row, Select } from 'antd';
import Highlighter from 'react-highlight-words';
import { format } from 'date-fns';
import { QuestionCircleOutlined } from '@ant-design/icons'
import { PlusOutlined } from '@ant-design/icons';

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
import { Suspense, useEffect, useId, useRef, useState } from 'react';
import { useGetUsersQuery } from '@/providers/apis/userApi';
import { useCreateCmtMutation, useGetAllQuery } from '@/providers/apis/cmtApi';
import { useCreateNoteMutation, useGetNotebyIdClientQuery, useDeleteNoteMutation, useUpdatesNoteMutation } from '@/providers/apis/noteApi';
import {
    useAddFinishLessonMutation,
    useGetCountQuery,
    useGetFinishLessonQuery,
    useGetLessonQuery,
    useGetNextLessonQuery,
} from '@/providers/apis/lessonApi';
import { useCallback } from 'react';
import Draggable from 'react-draggable';
import { useDispatch, useSelector } from 'react-redux';
import { addNextLesson } from '@/providers/slices/lessonSlice';
import { FaUpload } from 'react-icons/fa6';
import { CgEditFade, CgEditMarkup, CgRepeat } from 'react-icons/cg';


const cx = classNames.bind(styles);
const Learning = () => {
    const [valueNote, setValue] = useState('')
    const [idNote, setIdValue] = useState('')
    const { id } = useParams();
    const dispatch = useDispatch();
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
    const intervalRef = useRef();
    const { data: dataFinish, refetch: refetchDataFinish } = useGetFinishLessonQuery(userId);
    const { data: countLessonFinish, refetch: refetchCount } = useGetCountQuery(id);
    const completedLesson = allLesson?.lessons?.filter((lesson) => {
        return dataFinish?.data?.some((data) => data.lesson_id === lesson._id);
    });
    const nextLesson = useSelector((state) => state.lesson.nextLesson);
    const openLesson = [...(completedLesson ?? []), nextLesson];

    const isReachedLesson = completedLesson?.some((lesson) => lesson?._id === idLesson);
    const [open, setOpen] = useState(false);

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
    const [handleDeleteNote] = useDeleteNoteMutation();// xóa ghi chú
    const [handleUpdateNotes] = useUpdatesNoteMutation();// update ghi chú
    const [handleAddFinishLesson] = useAddFinishLessonMutation();
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
        debounce((path, indexLesson, chapterLeson) => {
            setIsModalShown(false);
            setPath(path);
            setLessonIndex(indexLesson - 1);
            setChapterIndex(chapterLeson - 1);
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
        const dispatchNextLesson = (lesson) => {
            dispatch(addNextLesson(lesson));
        };

        const lastIndex = dataFinish?.data.length > 0 ? dataFinish?.data[dataFinish?.data.length - 1] : null;
        const finishedLessonIndex = data?.courses?.chapters[chapterIndex]?.lessons.findIndex(
            (lesson) => lesson?._id === lastIndex?.lesson_id,
        );

        if (
            finishedLessonIndex !== -1 &&
            finishedLessonIndex === data?.courses?.chapters[chapterIndex]?.lessons.length - 1
        ) {
            if (chapterIndex < data?.courses?.chapters.length - 1) {
                const nextChapter = data?.courses?.chapters[chapterIndex + 1];
                const nextLesson = nextChapter?.lessons[0];
                dispatchNextLesson(nextLesson);
                // Lưu giá trị nextLesson vào local storage
                localStorage.setItem('nextLesson', JSON.stringify(nextLesson));
            }
        } else if (
            finishedLessonIndex !== -1 &&
            finishedLessonIndex < data?.courses?.chapters[chapterIndex]?.lessons.length - 1
        ) {
            const nextLesson = data?.courses?.chapters[chapterIndex]?.lessons[finishedLessonIndex + 1];
            dispatchNextLesson(nextLesson);
            localStorage.setItem('nextLesson', JSON.stringify(nextLesson));
        }
    }, [dataFinish, data, chapterIndex, dispatch]);

    useEffect(() => {
        // Lấy giá trị nextLesson từ local storage khi component được render
        const storedNextLesson = localStorage.getItem('nextLesson');
        if (storedNextLesson) {
            dispatch(addNextLesson(JSON.parse(storedNextLesson)));
        }
    }, [dispatch]);
    useEffect(() => {
        setIsModalShown(false);

        if (progressVideo >= 90) {
            setIsModalShown(true);
        } else if (isModalShown) {
            setIsModalShown(false);
        }

        if (!nextLesson && countLessonFinish?.count === countLesson) {
            setIsModalShown(false);
        }
    }, [progressVideo, isModalShown, dataFinish, nextLesson]);
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
    const debouncedHandleUpdateNote = useCallback(debounce(handleUpdateNotes, 1000), []); //thực hiện debounce để giảm tải cho server
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
        const progressDone = Math.floor((countLessonFinish?.count / count) * 100);
        setProgessCourse(progressDone);
        setCountLesson(count);
    }, [data, dataFinish, countLessonFinish]);
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
                setProgessVideo(0);
            } else {
                if (chapterIndex < data?.courses?.chapters.length - 1) {
                    setChapterIndex(chapterIndex + 1);
                    setLessonIndex(0);
                    setProgessVideo(0);
                }
            }
        }, 500),
        [chapterIndex, lessonIndex, data],
    );

    const handlePrev = useCallback(
        debounce(() => {
            if (lessonIndex > 0) {
                setLessonIndex(lessonIndex - 1);
                setProgessVideo(0);
            } else {
                if (chapterIndex > 0) {
                    setChapterIndex(chapterIndex - 1);
                    const prevChapter = data?.courses?.chapters[chapterIndex - 1];
                    setLessonIndex(prevChapter.lessons.length - 1 || prevChapter.lessons.length);
                    setProgessVideo(0);
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
            course_id: id,
        };
        setIsModalShown(false);
        setProgessVideo(0);
        handleAddFinishLesson(dataToSend).then(() => {
            const lesson = data?.courses?.chapters[chapterIndex]?.lessons[lessonIndex + 1];
            dispatch(addNextLesson(lesson));
            handleNext();

            refetchDataFinish();
            refetchCount();
        });
    };

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
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
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
    const listNote = noteData?.data?.map(item => {
        const { lessons } = allLesson;
        const lessonName = lessons.find((l) => l._id === item.lesson_id);

        const currentDate = item.updatedAt;
        const formattedDate = format(currentDate, 'dd/MM/yyyy');
        const formattedTime = format(currentDate, 'HH:mm:ss');
        return { idTest: item._id, name: lessonName.name, note: item.text, createdate: formattedDate, createTime: formattedTime }
    })

    const onDelete = (x) => {
        handleDeleteNote(x).then()
    }
    const showDrawer = (x) => {
        const a = noteData?.data?.find(item => item._id === x)
        setValue(a.text)
        setIdValue(a._id)

        setOpen(true);
    };
    const handleTextareaChange = (event) => {
        setValue(event.target.value);
    };
    const columns = [
        {
            title: 'Tên bài học',
            dataIndex: 'name',
            key: 'name',
            width: '35%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Nội dung ghi chú',
            dataIndex: 'note',
            key: 'note',
            width: '35%',
            ...getColumnSearchProps('note'),
        },
        {
            title: 'Ngày',
            dataIndex: 'createdate',
            key: 'createdate',
            width: '15%',
            ...getColumnSearchProps('createdate'),
        },
        {
            title: 'Giờ',
            dataIndex: 'createTime',
            key: 'createTime',
            width: '15%',
            ...getColumnSearchProps('createTime'),
        },
        {
            title: 'Action',
            dataIndex: 'idTest',
            width: '30%',
            key: 'idTest',

            render: (abc) => <div className='flex gap-[5px]'>
                <>
                    <Button type="primary" onClick={() => showDrawer(abc)} icon={<CgEditMarkup />}>
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
                    // extra={
                    //     // <Space>
                    //     //     <Button onClick={onClose}>Cancel</Button>
                    //     //     <Button onClick={onClose} type="primary">
                    //     //         Submit
                    //     //     </Button>
                    //     // </Space>
                    // }

                    >


                        <Form layout="vertical" hideRequiredMark >
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Form.Item
                                        name="text"
                                        label="Nội dung"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please enter user name',
                                            },
                                        ]}
                                    >
                                        <Input.TextArea rows={4} value={valueNote} onChange={handleTextareaChange} ref={refNoteInput} />
                                        <Button onClick={onNote} type="primary" className='mt-[10px]'>
                                            Submit
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>


                        </Form>
                    </Drawer>
                </>
                <Popconfirm
                    title="Xóa ghi chú"
                    description="Bạn chắc chắn muốn xóa không?"
                    onCancel={onClose}
                    onConfirm={() => onDelete(abc)}
                    icon={
                        <QuestionCircleOutlined
                            style={{
                                color: 'red',
                            }}
                        />
                    }
                >
                    <Button danger >Delete</Button>
                </Popconfirm>
            </div >,

        },
    ];

    const onNote = () => {
        const a = noteData?.data?.find(item => item._id === idNote)
        const updateNote = {
            ...a,
            _id: idNote,
            text: valueNote,
            updatedAt: new Date()
        }

        handleUpdateNotes(updateNote).then(() => {
            refNoteInput.current.value = '';
            refetchNote();
            setOpen(false);
        })
    };

    const onClose = () => {
        setOpen(false);

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
                                    Tiến độ: &emsp;<span className="progress_learned">{countLessonFinish?.count}</span>/
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
                                                const isOpen = handleIsOpen(lesson);
                                                console.log();
                                                return (
                                                    <div className={cx('learning__chapter--lesson')} key={lesson.id}>
                                                        {checkDone || isOpen || path === lesson.path_video ? (
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
                                {/* <select name="" id="note-wrapper-select">
                                    <option value="all" data-note="all" className={cx('note-option')}>
                                        -----Tất cả-----
                                    </option>
                                    <option value="only" data-note="only" className={cx('note-option')} onClick={onDelete}>
                                        -----Trong bài học này-----
                                    </option>
                                </select> */}
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
                                />;
                                {/* {noteData?.data?.map((item) => {
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
                                })} */}
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
