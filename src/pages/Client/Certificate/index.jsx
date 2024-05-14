import classNames from 'classnames/bind';
import styles from './Certificate.module.scss';
import images from '@/assets/images';
import { toPng } from 'html-to-image';
import React, { useEffect, useRef, useState } from 'react'; // Import useRef hook
import { useParams } from 'react-router-dom';
// import { useGetDetailQuery } from '@/providers/apis/courseApi';
import { useGetDetailQuery } from '@/providers/apis/courseTeacherApi';
import { useGetUsersQuery } from '@/providers/apis/userApi';
import { useCookies } from 'react-cookie';
import { Button, Col, Form, Input, Modal, Rate, notification } from 'antd';
import { useGetContentRatingQuery, useRateCourseMutation } from '@/providers/apis/rateApi';
const cx = classNames.bind(styles);

const Certificate = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [isOpen, setOpen] = useState(false);

    //const { data: dataCourses } = useGetDetailQuery(id);
    const { data: dataCourses } = useGetDetailQuery(id)
    const { data: rateData, isLoading: isLoadingRateData } = useGetContentRatingQuery();
    const [cookies, setCookie] = useCookies('cookieLoginStudent');
    const [handleRateCourse] = useRateCourseMutation();
    const [isLoading, setLoading] = useState(false);
    const certificateWrapperRef = useRef(null);

    const isRated = rateData?.rates?.some(
        (rate) => rate.user_id.email === cookies.cookieLoginStudent.email && rate.course_id._id === id,
    );
    const nameCert = cookies.cookieLoginStudent.fullName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    const nameCourse = dataCourses?.courses?.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    const handleDownloadCertificate = () => {
        if (certificateWrapperRef.current) {
            setLoading(true);
            toPng(certificateWrapperRef.current)
                .then(function (dataUrl) {
                    const link = document.createElement('a');
                    link.download = `certificate-${nameCert}-${nameCourse}.png`;
                    link.href = dataUrl;
                    link.click();
                })
                .catch(function (error) {
                    console.error('Error exporting certificate:', error);
                })
                .finally(function () {
                    setLoading(false);
                });
        }
    };
    const handleSubmit = async (data) => {
        setOpen(false);
        await handleRateCourse({
            content: data.text,
            rating: data.rate,
            course_id: id,
        });
        form.resetFields();
        notification.success({
            message: 'Thông báo',
            description: 'Cảm ơn bạn đã đánh giá !',
            duration: 1.75,
        });
    };
    const onCancel = () => {
        setOpen(false);
    };
    useEffect(() => {
        if (!isLoadingRateData) {
            if (isRated) {
                setOpen(false);
            } else {
                setOpen(true);
            }
        }
    }, [rateData]);
    return (
        <>
            <div className={cx('certificate_wrapper')}>
                <Modal open={isOpen} closable={true} onCancel={onCancel} centered={true} footer={false}>
                    <div>
                        <h2>Đánh giá khóa học</h2>
                        <Form layout="vertical" form={form} autoComplete="off" onFinish={handleSubmit}>
                            <Col gutter={16}>
                                <Col span={24}>
                                    <Form.Item name="rate" label="Đánh giá">
                                        <Rate />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item name="text" label="Nội dung">
                                        <Input.TextArea rows={4} />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            Đánh giá
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Col>
                        </Form>
                    </div>
                </Modal>

                <div className={cx('container')}>
                    <h2 className={cx('cert-title')}>Nhận chứng chỉ</h2>
                    <p className={cx('cert-text')}>
                        BrainTech ghi nhận sự nỗ lực của bạn! Bằng cách nhận chứng chỉ này, bạn chính thức hoàn thành
                        khóa học <strong></strong>.
                    </p>

                    <div ref={certificateWrapperRef} className={cx('cert-main')}>
                        <div className={cx('cert-info')}>
                            <img className={cx('cert-image')} src={images.cert} alt="" />
                            <div className={cx('cert-nameUser')}>{cookies.cookieLoginStudent.fullName}</div>
                            <div className={cx('cert-nameCourse')}>{dataCourses?.course?.name}</div>
                        </div>
                    </div>
                </div>
                <button className={cx('button-download')} onClick={handleDownloadCertificate}>
                    Tải xuống chứng chỉ
                    {isLoading ? (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                stroke="#ffffff"
                            >
                                <g fill="none" fill-rule="evenodd" stroke-width="2">
                                    <circle cx="12" cy="12" r="10">
                                        <animate
                                            attributeName="stroke-dasharray"
                                            dur="1.9s"
                                            values="1 200;90 150;90 150"
                                            repeatCount="indefinite"
                                        />
                                        <animate
                                            attributeName="stroke-dashoffset"
                                            dur="1.9s"
                                            values="0;-40;-140"
                                            repeatCount="indefinite"
                                        />
                                    </circle>
                                </g>
                            </svg>
                        </>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-download"
                            viewBox="0 0 16 16"
                        >
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                        </svg>
                    )}
                </button>
            </div>
        </>
    );
};

export default Certificate;
