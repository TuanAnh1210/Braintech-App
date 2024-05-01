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
import { Button, Col, Drawer, Empty, Form, Input, Popconfirm, Popover, Row, Space, Table, Tabs } from 'antd';
import React from 'react';

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
const cx = classNames.bind(styles);

const Comments = ({ openStorage, setOpenStorage }) => {
    const [open, setOpen] = React.useState(false);
    const [valueNote, setValue] = React.useState('');
    const [idNote, setIdValue] = React.useState('');
    const [err, setErrNote] = React.useState('');
    const [isDelete, setDelete] = React.useState(false);

    const [isComment, setCommment] = React.useState(true); // đang là bình luận hay ghi chú (true false)
    const [cmtInput, setCmtInput] = React.useState(''); // nội dung của cmt
    const [cmtUpdateInput, setCmtUpdateInput] = React.useState(''); // nội dung của cmt
    const [noteInput, setNoteInput] = React.useState(''); //nội dung của ghi chú
    const [isUpdateCmt, setUpdateCmt] = React.useState({ update: false });
    const [searchText, setSearchText] = React.useState('');
    const [searchedColumn, setSearchedColumn] = React.useState('');

    const ref = React.useRef(null);
    const refNoteInput = React.useRef(null);
    const searchInput = React.useRef(null);

    const { courseId, lessonId } = useParams();

    const [handleAddNote] = useCreateNoteMutation(); //thêm ghi chú
    const [handleAddCmt] = useCreateCmtMutation(); //thêm bình luận
    const [handleUpdateCmt] = useUpdateCmtMutation();
    const [handleDeleteNote] = useDeleteNoteMutation(); // xóa ghi chú
    const [handleUpdateNotes] = useUpdateNoteMutation(); // update ghi chú
    const [deleteCmt] = useDeleteCmtMutation();

    const { data: cmtData = [], isLoading: cmtLoading, isFetching: cmtFetching, refetch } = useGetAllQuery(lessonId); //lấy bình luận dựa trên id bài học
    const { data: noteData = [], refetch: refetchNote } = useGetNoteByLessonIdQuery(lessonId); // lấy tất cả các ghi chú của người dùng

    const handleClickScroll = () => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
    }; // thực hiện scroll

    const handleSubmitNote = (e) => {
        e.preventDefault();
        const newNote = {
            content: noteInput,
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
            lesson_id: lessonId,
        };

        handleAddCmt(newCmt)
            .then(() => {
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

    const handleSubmitUpdateCmt = (e) => {
        e.preventDefault();
        const updateData = { content: cmtUpdateInput, id: isUpdateCmt._id };
        handleUpdateCmt(updateData).then(() => {
            refetch();
            setUpdateCmt({ update: false });
            setCmtUpdateInput('');
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
            title: 'Nội dung',
            dataIndex: 'text',
            width: '30%',
            ...getColumnSearchProps('text'),
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
            _id: idNote,
            text: valueNote,
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

    const handleSubmitDeleteCmt = (id) => {
        deleteCmt(id).then(() => refetch());
        setDelete({ isDeleteCmt: false });
    };

    return (
        <div style={{ background: '#fff', padding: '0 16px 0 16px', borderRadius: '12px 12px 0 0' }}>
            {isDelete.isDeleteCmt === true && (
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
            )}
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
                                        <Tabs
                                            tabBarStyle={{ margin: '0' }}
                                            defaultActiveKey="1"
                                            items={[
                                                {
                                                    key: '1',
                                                    label: `Tất cả bình luận`,
                                                },
                                                {
                                                    key: '2',
                                                    label: `Bình luận của tôi`,
                                                },
                                            ]}
                                        />
                                        {cmtLoading && cmtFetching ? (
                                            <div className="flex flex-col items-center justify-center my-16">
                                                <LoadingOutlined className="text-3xl" />
                                                <span className="mt-3">Đang tải...</span>
                                            </div>
                                        ) : (
                                            cmtData.map((cmt) => {
                                                return (
                                                    <div className={cx('commentBox', 'noMt')} key={Math.random()}>
                                                        <img
                                                            className={cx('commentBox--img')}
                                                            style={{ margin: 0 }}
                                                            src="https://yt3.ggpht.com/UsflU74uvka_3sejOu3LUGwzOhHJV0eIYoWcvOfkOre_c12uIN4ys-QqRlAkbusEmbZjTA-b=s88-c-k-c0x00ffffff-no-rj"
                                                            alt=""
                                                        />

                                                        <div
                                                            className={cx('commentBox--right')}
                                                            style={{ background: '#ecf0f1' }}
                                                        >
                                                            {isUpdateCmt.update === true &&
                                                            cmt._id === isUpdateCmt._id ? (
                                                                <form
                                                                    className={cx('mt-6')}
                                                                    onSubmit={handleSubmitUpdateCmt}
                                                                >
                                                                    <textarea
                                                                        rows={4}
                                                                        required={true}
                                                                        name="contentUpdateIpt"
                                                                        className={cx('commentBox--ipt')}
                                                                        placeholder="Nhập bình luận của bạn"
                                                                        onChange={(e) =>
                                                                            setCmtUpdateInput(e.target.value)
                                                                        }
                                                                        value={cmtUpdateInput}
                                                                    />
                                                                    <div className="flex gap-2">
                                                                        <Button
                                                                            onClick={() =>
                                                                                setUpdateCmt({
                                                                                    update: false,
                                                                                    ...cmt,
                                                                                })
                                                                            }
                                                                            type="default"
                                                                        >
                                                                            Đóng
                                                                        </Button>
                                                                        <Button type="primary" htmlType="submit">
                                                                            Cập nhật
                                                                        </Button>
                                                                    </div>
                                                                </form>
                                                            ) : (
                                                                <div>
                                                                    <h5>
                                                                        {cmt?.user_id?.full_name || 'Người ẩn danh'}
                                                                    </h5>
                                                                    <p className={cx('commentBox--text')}>{cmt.text}</p>
                                                                </div>
                                                            )}

                                                            <Popover
                                                                placement="bottom"
                                                                content={
                                                                    <div className="flex gap-2">
                                                                        <Button
                                                                            onClick={() => {
                                                                                setUpdateCmt({ update: true, ...cmt });
                                                                                setCmtUpdateInput(cmt.text);
                                                                            }}
                                                                            type="primary"
                                                                            className="flex items-center gap-2"
                                                                        >
                                                                            <span>Sửa</span>
                                                                            <FontAwesomeIcon icon={faPen} />
                                                                        </Button>

                                                                        <Button
                                                                            // onClick={() => handleDelete(cmt._id)}
                                                                            type="primary"
                                                                            className="flex items-center gap-2"
                                                                            danger
                                                                        >
                                                                            <span>Xóa</span>
                                                                            <FontAwesomeIcon icon={faTrash} />
                                                                        </Button>
                                                                    </div>
                                                                }
                                                                title={'Thao tác'}
                                                            >
                                                                {cmt.isMyComment && (
                                                                    <FontAwesomeIcon
                                                                        className="absolute top-4 right-4 cursor-pointer text-amber-600 text-lg"
                                                                        icon={faEllipsis}
                                                                    />
                                                                )}
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                        {cmtData.length === 0 && (
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
                                    y: 340,
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
