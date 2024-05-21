import {
    useCreateCmtMutation,
    useDeleteCmtMutation,
    useGetAllQuery,
    useUpdateCmtMutation,
} from '@/providers/apis/cmtApi';
import React, { useEffect, useState } from 'react';
import styles from './Learning.module.scss';
import classNames from 'classnames/bind';
import { Button, Popover } from 'antd';
import { faComments, faEllipsis, faPaperPlane, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Draggable from 'react-draggable';
const cx = classNames.bind(styles);
const CommentItem = ({ cmt, refetch }) => {
    const toggleReplyForm = (cmt) => {
        setShowReplyForm({ reply: true, ...cmt });
    };
    const [replyText, setReplyText] = useState('');
    const [showReplyForm, setShowReplyForm] = useState({ reply: false });
    const handleReplySubmit = (e) => {
        e.preventDefault();
        const regex = /^\s*$/;
        if (regex.test(replyText)) {
            setErrCmt('Vui lòng nhập ký tự khác khoảng trắng.')
        } else {
            setErrCmt('');
            const newCmt = {
                content: replyText,
                lesson_id: showReplyForm.lesson_id,
                parent_id: showReplyForm.parent_id || showReplyForm._id,
            };

            handleAddCmt(newCmt)
                .then(() => {
                    setParentComment(null);
                    refetch();
                })
                .catch((error) => {
                    console.error('Error adding comment:', error);
                });
            setShowReplyForm({ reply: false });
            setReplyText('');
        };

    };
    const handleDelete = (id) => {
        setDelete({ isDeleteCmt: true, id: id });
    };

    const handleSubmitUpdateCmt = (e) => {
        e.preventDefault();
        const updateData = { content: cmtUpdateInput, id: isUpdateCmt._id };
        const regex = /^\s*$/;
        if (regex.test(updateData)) {
            setErrCmt('Vui lòng nhập ký tự khác khoảng trắng.')
        } else {
            handleUpdateCmt(updateData).then(() => {
                refetch();
                setUpdateCmt({ update: false });
                setCmtUpdateInput('');
            });
        }
    };
    const [errCmt, setErrCmt] = useState('')
    const handleSubmitDeleteCmt = (id) => {
        deleteCmt(id).then(() => refetch());
        setDelete({ isDeleteCmt: false });
    };
    const [handleUpdateCmt] = useUpdateCmtMutation();
    const [deleteCmt] = useDeleteCmtMutation();
    const [handleAddCmt] = useCreateCmtMutation();
    const [cmtUpdateInput, setCmtUpdateInput] = React.useState(''); // nội dung của cmt
    const [isUpdateCmt, setUpdateCmt] = React.useState({ update: false });
    const [parentComment, setParentComment] = useState(null);
    const [isDelete, setDelete] = React.useState(false);

    const maxVisibleComments = 3;
    const [visibleComments, setVisibleComments] = useState([]);
    const [showAllComments, setShowAllComments] = useState(false);
    const reversedCmtData = [...cmt.comments].reverse();
    useEffect(() => {
        if (reversedCmtData.length <= maxVisibleComments) {
            setVisibleComments(reversedCmtData);
        } else {
            setVisibleComments(reversedCmtData.slice(0, maxVisibleComments));
        }
    }, [cmt]);

    const handleLoadMoreComments = () => {
        const currentlyVisibleComments = visibleComments.length;
        const nextVisibleComments = currentlyVisibleComments + maxVisibleComments;
        setVisibleComments(reversedCmtData.slice(0, nextVisibleComments));
        setShowAllComments(nextVisibleComments >= reversedCmtData.length);
    };

    return (
        <>
            {isDelete.isDeleteCmt === true && (
                <Draggable>
                    <div className={cx('message__delete')}>
                        <h2>Bạn muốn xóa bình luận này chứ!!</h2>
                        <h4>Nhấn yes để xóa nhé</h4>
                        <div className={cx('btn__delete-container', 'gap-6')}>
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
            <img
                className={cx('commentBox--img')}
                style={{ margin: 0 }}
                src={
                    cmt?.user_id?.avatar ||
                    'https://yt3.ggpht.com/UsflU74uvka_3sejOu3LUGwzOhHJV0eIYoWcvOfkOre_c12uIN4ys-QqRlAkbusEmbZjTA-b=s88-c-k-c0x00ffffff-no-rj'
                }
                alt=""
            />

            <div className={cx('commentBox--right')} style={{ background: '#ecf0f1' }}>
                {isUpdateCmt.update === true && cmt._id === isUpdateCmt._id ? (
                    <form className={cx('mt-6')} onSubmit={handleSubmitUpdateCmt}>
                        <textarea
                            rows={4}
                            required={true}
                            name="contentUpdateIpt"
                            className={cx('commentBox--ipt')}
                            placeholder="Nhập bình luận của bạn"
                            onChange={(e) => setCmtUpdateInput(e.target.value)}
                            value={cmtUpdateInput}
                        />
                        {errCmt && (<p className='text-sm text-red-600 italic'>*{errCmt}</p>)}
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
                        <h5>{cmt?.user_id?.full_name || 'Người ẩn danh'}</h5>
                        <p className={cx('commentBox--text')}>{cmt.text}</p>
                        <div className="flex gap-2 text-[12px]">
                            {cmt.isMyComment && (
                                <>
                                    <div
                                        onClick={() => {
                                            setUpdateCmt({ update: true, ...cmt });
                                            setCmtUpdateInput(cmt.text);
                                        }}
                                        className="flex items-center gap-2 italic hover:underline ml-4"
                                    >
                                        <span>Sửa</span>
                                        <FontAwesomeIcon icon={faPen} />
                                    </div>

                                    <div
                                        onClick={() => handleDelete(cmt._id)}
                                        className="flex items-center gap-2 italic hover:underline ml-4"
                                        danger
                                    >
                                        <span>Xóa</span>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </div>
                                </>
                            )}
                            <div
                                onClick={() => toggleReplyForm(cmt)}
                                className="flex items-center gap-2 italic hover:underline ml-4"
                            >
                                <span>Trả lời</span>
                                <FontAwesomeIcon icon={faComments} />
                            </div>
                        </div>
                    </div>
                )}

                {/* <Popover
                    placement="bottom"
                    content={
                        
                    }
                    title={'Thao tác'}
                >
                    {cmt.isMyComment && (
                        <FontAwesomeIcon
                            className="absolute top-4 right-4 cursor-pointer text-amber-600 text-lg"
                            icon={faEllipsis}
                        />
                    )}
                </Popover> */}

                {showReplyForm.reply === true && showReplyForm._id == cmt._id && (
                    <form className={cx('form__comment')} onSubmit={handleReplySubmit}>
                        <div className="flex items-center py-2 gap-2">
                            <span className="font-bold">Trả lời bình luận</span>
                            <FontAwesomeIcon icon={faComments} />
                        </div>
                        <textarea
                            rows={4}
                            required={true}
                            name="cmt_content"
                            className={cx('commentBox--ipt')}
                            placeholder="Gửi bình luận của bạn..."
                            onChange={(e) => setReplyText(e.target.value)}
                            value={replyText}
                        />
                        {errCmt && (<p className='text-sm text-red-600 italic'>*{errCmt}</p>)}
                        <div className='flex justify-end items-center'>
                            <Button
                                onClick={() =>
                                    setShowReplyForm({ reply: false })
                                }
                                type="default"
                                className='h-10 mt-[3px] mr-5'
                            >
                                Đóng
                            </Button>
                            <button className={cx('send__comment', 'flex items-center gap-2')}>
                                Gửi bình luận
                                <FontAwesomeIcon icon={faPaperPlane} />
                            </button>
                        </div>
                    </form>
                )}
                {reversedCmtData.length > 0 ? (
                    <>
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
                    </>
                ) : (
                    <></>
                )}
            </div >
        </>
    );
};
export default React.memo(CommentItem);
