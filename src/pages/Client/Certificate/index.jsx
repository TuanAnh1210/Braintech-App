import classNames from 'classnames/bind';
import styles from './Certificate.module.scss';
import images from '@/assets/images';

import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetDetailQuery } from '@/providers/apis/courseApi';
import { useGetUsersQuery } from '@/providers/apis/userApi';
const cx = classNames.bind(styles);

const Certificate = () => {
    const { id } = useParams();
    const { data: dataCourses } = useGetDetailQuery(id);
    const { fullName } = JSON.parse(localStorage.getItem('access_token')); //lấy token được lưu khi người dùng đăng nhập
    
    return (
        <>
            <div className={cx('certificate_wrapper')}>
                <div className={cx('container')}>
                    <h2 className={cx('cert-title')}>Nhận chứng chỉ</h2>
                    <p className={cx('cert-text')}>
                        BrainTech ghi nhận sự nỗ lực của bạn! Bằng cách nhận chứng chỉ này, bạn chính thức hoàn thành
                        khóa học <strong></strong>.
                    </p>

                    <div className={cx('cert-info')}>
                        <img className={cx('cert-image')} src={images.cert} alt="" />
                        <div className={cx('cert-nameUser')}>{fullName}</div>
                        <div className={cx('cert-nameCourse')}>{dataCourses.courses.name}</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Certificate;
