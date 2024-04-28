import classNames from 'classnames/bind';
import styles from './Certificate.module.scss';
import images from '@/assets/images';
import { toPng } from 'html-to-image';
import React, { useRef, useState } from 'react'; // Import useRef hook
import { useParams } from 'react-router-dom';
import { useGetDetailQuery } from '@/providers/apis/courseApi';
import { useGetUsersQuery } from '@/providers/apis/userApi';
import { useCookies } from 'react-cookie';
const cx = classNames.bind(styles);

const Certificate = () => {
    const { id } = useParams();
    const { data: dataCourses } = useGetDetailQuery(id);
    const [cookies, setCookie] = useCookies('cookieLoginStudent');
    const [isLoading, setLoading] = useState(false);
    const certificateWrapperRef = useRef(null);
    const nameCert = cookies.cookieLoginStudent.fullName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    const nameCourse = dataCourses?.courses?.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    const handleDownloadCertificate = () => {
        if (certificateWrapperRef.current) {
            setLoading(true);
            toPng(certificateWrapperRef.current)
                .then(function (dataUrl) {
                    // Tạo một đường dẫn tải xuống cho hình ảnh
                    const link = document.createElement('a');
                    link.download = `certificate-${nameCert}-${nameCourse}.png`; // Tên file khi tải xuống
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
    
    return (
        <>
            <div className={cx('certificate_wrapper')}>
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
                            class="bi bi-download"
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
