/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { faEllipsis, faPen, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { SearchOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import React from 'react';

import styles from './Learning.module.scss';
import { useCreateCmtMutation, useGetAllQuery, useUpdateCmtMutation } from '@/providers/apis/cmtApi';
import {
    useCreateNoteMutation,
    useDeleteNoteMutation,
    useGetNoteByLessonIdQuery,
    useUpdateNoteMutation,
} from '@/providers/apis/noteApi';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Drawer, Form, Input, Popconfirm, Row, Space, Table } from 'antd';
import { format } from 'date-fns';
import Highlighter from 'react-highlight-words';
const cx = classNames.bind(styles);

const Comments = ({ openStorage, setOpenStorage }) => {
    const [open, setOpen] = React.useState(false);
    const [valueNote, setValue] = React.useState('');
    const [idNote, setIdValue] = React.useState('');
    const [err, setErrNote] = React.useState('');

    const [isComment, setCommment] = React.useState(true); // đang là bình luận hay ghi chú (true false)
    const [cmtInput, setCmtInput] = React.useState(''); // nội dung của cmt
    const [noteInput, setNoteInput] = React.useState(''); //nội dung của ghi chú
    const [isUpdateCmt, setUpdateCmt] = React.useState({ update: false });
    const [searchText, setSearchText] = React.useState('');
    const [searchedColumn, setSearchedColumn] = React.useState('');

    const ref = React.useRef(null);
    const refCmtInput = React.useRef(null);
    const refNoteInput = React.useRef(null);
    const searchInput = React.useRef(null);

    const { courseId, lessonId } = useParams();

    const [handleAddNote] = useCreateNoteMutation(); //thêm ghi chú
    const [handleAddCmt] = useCreateCmtMutation(); //thêm bình luận
    const [handleUpdateCmt] = useUpdateCmtMutation();
    const [handleDeleteNote] = useDeleteNoteMutation(); // xóa ghi chú
    const [handleUpdateNotes] = useUpdateNoteMutation(); // update ghi chú

    const { data: cmtData, isLoading: cmtLoading, isFetching: cmtFetching, refetch } = useGetAllQuery(lessonId); //lấy bình luận dựa trên id bài học
    const { data: noteData, refetch: refetchNote } = useGetNoteByLessonIdQuery(lessonId); // lấy tất cả các ghi chú của người dùng

    const handleClickScroll = () => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }; // thực hiện scroll

    const handleSubmitNote = (e) => {
        e.preventDefault();
        const newNote = {
            content: noteInput,
            user_id: 'userId',
            lesson_id: lessonId,
        };
        // console.log(newNote);
        handleAddNote(newNote).then(() => {
            // gửi dữ liêu được nhập về backend
            refNoteInput.current.value = '';

            setNoteInput('');
            refetchNote();
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newCmt = {
            content: cmtInput,
            user_id: 'userId',
            lesson_id: lessonId,
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

    // const handleDelete = (id) => {
    //     setDelete({ isDeleteCmt: true, id: id });
    // };

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

    const listNote = noteData?.data?.map((item) => {
        const currentDate = item.updatedAt;
        const formattedDate = format(currentDate, 'dd/MM/yyyy');
        const formattedTime = format(currentDate, 'HH:mm:ss');

        return {
            idTest: item._id,
            // name: currentLesson?.name,
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

    return (
        <>
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
                                    // dataUser
                                    const user = []?.data?.find((data) => {
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
                                                <h5>{user?.full_name ? user?.full_name : user?.email}</h5>
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

                                                {user?._id == 'userId' && (
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
                                                                <FontAwesomeIcon className={cx('icon')} icon={faPen} />
                                                            </p>

                                                            <p
                                                                className={cx('btn_option-cmt')}
                                                                // onClick={() => handleDelete(cmt._id)}
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

            {openStorage && (
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
            )}
        </>
    );
};

export default Comments;
