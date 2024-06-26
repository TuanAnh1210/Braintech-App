/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { LoadingOutlined } from '@ant-design/icons';
import { faComments, faEllipsis, faPaperPlane, faPen, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import Highlighter from 'react-highlight-words';
import Draggable from 'react-draggable';
import { Button, Col, Drawer, Empty, Form, Input, Popconfirm, Popover, Row, Space, Table, Tabs, message } from 'antd';
import React, { useEffect, useState } from 'react';

import {
    useCreateCmtMutation,
    useDeleteCmtMutation,
    useGetAllQuery,
    useUpdateCmtMutation,
} from '@/providers/apis/cmtApi';
import {
    useCreateNoteMutation,
    useDeleteNoteMutation,
    useGetNoteByLessonIdQuery,
    useUpdateNoteMutation,
} from '@/providers/apis/noteApi';

import styles from './Learning.module.scss';
import CommentItem from './CommentItem';
const cx = classNames.bind(styles);

const Comments = ({ openStorage, timeVideo, setTimeChanges, setOpenStorage }) => {
    const [open, setOpen] = React.useState(false);
    const [valueNote, setValue] = React.useState('');
    const [idNote, setIdValue] = React.useState('');
    const [err, setErrNote] = React.useState('');

    const [isComment, setCommment] = React.useState(true); // đang là bình luận hay ghi chú (true false)
    const [cmtInput, setCmtInput] = React.useState(''); // nội dung của cmt

    const [noteInput, setNoteInput] = React.useState(''); //nội dung của ghi chú

    const [searchText, setSearchText] = React.useState('');
    const [searchedColumn, setSearchedColumn] = React.useState('');

    const ref = React.useRef(null);
    const refNoteInput = React.useRef(null);
    const searchInput = React.useRef(null);

    const { courseId, lessonId } = useParams();

    const [handleAddNote] = useCreateNoteMutation(); //thêm ghi chú
    const [handleAddCmt] = useCreateCmtMutation(); //thêm bình luận

    const [handleDeleteNote] = useDeleteNoteMutation(); // xóa ghi chú
    const [handleUpdateNotes] = useUpdateNoteMutation(); // update ghi chú

    const { data: cmtData = [], isLoading: cmtLoading, isFetching: cmtFetching, refetch } = useGetAllQuery(lessonId); //lấy bình luận dựa trên id bài học
    const { data: noteData = [], refetch: refetchNote } = useGetNoteByLessonIdQuery(lessonId); // lấy tất cả các ghi chú của người dùng
    const handleClickScroll = () => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }; // thực hiện scroll
    const reversedCmtData = [...cmtData].reverse();
    const handleSubmitNote = (e) => {
        e.preventDefault();
        const newNote = {
            save_at: timeVideo,
            content: noteInput,
            lesson_id: lessonId,
        };
        handleAddNote(newNote).then(({ data }) => {
            message.success(data.message);
            setNoteInput('');
            refetchNote();
        });
    };
    const [errCmt, setErrCmt] = useState('')
    const [showAllComments, setShowAllComments] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        const regex = /^\s*$/;
        if (regex.test(cmtInput)) {
            setErrCmt('Vui lòng nhập ký tự khác khoảng trắng.');
            // return
        } else {
            setErrCmt('');
            const newCmt = {
                content: cmtInput,
                lesson_id: lessonId,
                parent_id: parentComment,
            };

            handleAddCmt(newCmt)
                .then(() => {
                    setCmtInput('');
                    setParentComment(null);
                    setShowAllComments(false)
                    refetch();
                })
                .catch((error) => {
                    console.error('Error adding comment:', error);
                    // Handle error if necessary
                });
        };
    }
    const [isDelete, setDelete] = React.useState(false);

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

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const onDelete = (x) => {
        handleDeleteNote(x).then(() => {
            refNoteInput.current.value = '';
            refetchNote();
        });
    };

    const showDrawer = async (noteId) => {
        const note = await noteData?.find((item) => item._id === noteId);
        setValue(note.text);
        setIdValue(note._id);
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
            dataIndex: 'lesson_id',
            width: '30%',
            render: (lesson_id) => {
                return <b>{lesson_id.name}</b>;
            },
        },
        {
            title: 'Lưu tại',
            dataIndex: 'save_at',
            width: '30%',
            render: (save_at) => {
                return (
                    <b
                        onClick={() => setTimeChanges((prev) => ({ video_time: save_at, random_time: Math.random() }))}
                        className="text-blue-500 font-medium hover:underline cursor-pointer"
                    >
                        {secondsToMinutes(save_at)}
                    </b>
                );
            },
        },
        {
            title: 'Nội dung',
            dataIndex: 'text',
            width: '30%',
            render: (text) => {
                return <div className="line-clamp-3">{text}</div>;
            },
            // ...getColumnSearchProps('text'),
        },
        {
            width: '30%',
            title: 'Ngày - Giờ',
            dataIndex: 'updatedAt',
            render: (updatedAt) => {
                const formattedDate = format(updatedAt, 'dd/MM/yyyy');
                const formattedTime = format(updatedAt, 'HH:mm:ss');
                return <div>{`${formattedDate}  - ${formattedTime}`}</div>;
            },
        },
        {
            title: 'Thao tác',
            dataIndex: '_id',
            width: '25%',
            key: '_id',
            render: (_id) => (
                <div className="flex gap-[5px]">
                    <>
                        <Button type="primary" onClick={() => showDrawer(_id)}>
                            Sửa
                        </Button>
                        <Drawer
                            title=""
                            width={500}
                            onClose={onClose}
                            open={open}
                            destroyOnClose={true}
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
                                                rows={10}
                                            />
                                            <Button type="primary" htmlType="submit" className="mt-[10px]">
                                                Cập nhật
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
                        onConfirm={() => onDelete(_id)}
                        ref={refNoteInput}
                        icon={
                            <QuestionCircleOutlined
                                style={{
                                    color: 'red',
                                }}
                            />
                        }
                    >
                        <Button danger>Xóa</Button>
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
            _id: idNote,
            text: valueNote,
            save_at: timeVideo,
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

    function secondsToMinutes(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    const [parentComment, setParentComment] = useState(null);
    const maxVisibleComments = 3;
    const [visibleComments, setVisibleComments] = useState([]);


    useEffect(() => {
        if (reversedCmtData.length <= maxVisibleComments) {
            setVisibleComments(reversedCmtData);
        } else {
            setVisibleComments(reversedCmtData.slice(0, maxVisibleComments));
        }
    }, [cmtData]);

    const handleLoadMoreComments = () => {
        const currentlyVisibleComments = visibleComments.length;
        const nextVisibleComments = currentlyVisibleComments + maxVisibleComments;
        setVisibleComments(reversedCmtData.slice(0, nextVisibleComments));
        setShowAllComments(nextVisibleComments >= reversedCmtData.length);
    };

    return (
        <div style={{ background: '#fff', padding: '0 16px 0 16px', borderRadius: '12px 12px 0 0' }}>
            <div className={cx('comment__wrapper', 'note comment')}>
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            label: `Bình luận`,
                            key: '1',
                            children: (
                                <div className="commentZone">
                                    <div className={cx('commentBox')}>
                                        <img
                                            style={{
                                                marginTop: '32px',
                                            }}
                                            className={cx('commentBox--img')}
                                            src="https://yt3.ggpht.com/UsflU74uvka_3sejOu3LUGwzOhHJV0eIYoWcvOfkOre_c12uIN4ys-QqRlAkbusEmbZjTA-b=s88-c-k-c0x00ffffff-no-rj"
                                            alt=""
                                        />

                                        <form className={cx('form__comment')} onSubmit={handleSubmit}>
                                            <div className="flex items-center py-2 gap-2">
                                                <span className="font-bold">Nhập bình luận của bạn</span>
                                                <FontAwesomeIcon icon={faComments} />
                                            </div>
                                            <textarea
                                                rows={4}
                                                required={true}
                                                name="cmt_content"
                                                className={cx('commentBox--ipt')}
                                                placeholder="Gửi bình luận của bạn"
                                                onChange={(e) => setCmtInput(e.target.value)}
                                                value={cmtInput}
                                            />
                                            {errCmt && (<p className='text-sm text-red-600 italic'>*{errCmt}</p>)}
                                            <button className={cx('send__comment', 'flex items-center gap-2')}>
                                                Gửi bình luận
                                                <FontAwesomeIcon icon={faPaperPlane} />
                                            </button>
                                        </form>
                                    </div>

                                    <div
                                        className={cx('comment_wrapper-content')}
                                        style={{ minHeight: '500px', marginTop: '20px' }}
                                    >
                                        {cmtLoading && cmtFetching ? (
                                            <div className="flex flex-col items-center justify-center my-16">
                                                <LoadingOutlined className="text-3xl" />
                                                <span className="mt-3">Đang tải...</span>
                                            </div>
                                        ) : (
                                            <div className='w-[100%]'>
                                                {visibleComments.map((cmt) => (
                                                    <div className={cx('commentBox', 'noMt')} key={cmt.id}>
                                                        <CommentItem cmt={cmt} refetch={refetch} />
                                                    </div>
                                                ))}
                                                {!showAllComments && reversedCmtData.length > maxVisibleComments && (
                                                    <button className="show-more-button mt-4 ml-[60px] italic font-bold" onClick={handleLoadMoreComments}>
                                                        ...Xem thêm
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {reversedCmtData.length === 0 && (
                                            <Empty className="my-8" description="Chưa có dữ liệu" />
                                        )}
                                    </div>
                                </div>
                            ),
                        },
                        {
                            label: `Ghi chú`,
                            key: '2',
                            children: (
                                <div className={cx('noteZone')}>
                                    <form className={cx('noteForm')} onSubmit={handleSubmitNote}>
                                        <h6 className={cx('note--title', 'font-bold')}>
                                            Thêm ghi chú tại <span className={cx('note--time')}>bài học này</span>
                                        </h6>

                                        <div className="form__group">
                                            <textarea
                                                required
                                                placeholder="Nội dung ghi chú..."
                                                className={cx('note--ipt', 'border outline-none rounded-lg')}
                                                name="note_content"
                                                cols="10"
                                                rows={5}
                                                ref={refNoteInput}
                                                onChange={(e) => {
                                                    setNoteInput(e.target.value);
                                                }}
                                                value={noteInput}
                                            />
                                        </div>

                                        <button className={cx('send__comment')}>
                                            Thêm ghi chú tại {secondsToMinutes(timeVideo)}
                                        </button>
                                    </form>
                                </div>
                            ),
                        },
                    ]}
                />
            </div>

            {openStorage && (
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
                                rowKey={(record) => record._id}
                                columns={columns}
                                dataSource={noteData}
                                pagination={{
                                    pageSize: 50,
                                }}
                                scroll={{
                                    y: 360,
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default React.memo(Comments);
