import { Button } from 'antd';
import React from 'react';
import RateList from './RateList';
import { useState } from 'react';
import ReactTextMoreLess from 'react-text-more-less';
import classNames from 'classnames/bind';
import styles from './DetailCourse.module.scss';
import { useGetContentRatingQuery } from '@/providers/apis/rateApi';
import { FaStar } from 'react-icons/fa6';
const cx = classNames.bind(styles);

const RatingSide = ({ idCourse }) => {
    const [isOpen, setOpen] = useState(false);
    const [collapsed, setState] = useState(false);
    const { data: dataRate, isLoading } = useGetContentRatingQuery(idCourse);
    const onCancel = () => {
        setOpen(false);
    };
    return (
        <div>
            <h2 className={cx('rate--title')}>Đánh giá khóa học</h2>
            <div className={cx('list-rate')}>
                {dataRate?.rates?.length > 0 ? (
                    <>
                        {dataRate?.rates.slice(0, 4).map((rate) => {
                            return (
                                <div className={cx('card-rate')} key={rate._id}>
                                    <div className={cx('info')}>
                                        <img width={50} src={rate?.user_id.avatar} />
                                        <div>
                                            <p>{rate?.user_id.full_name}</p>
                                            <p className="flex">
                                                {[...Array(rate?.rating)].map((_, index) => (
                                                    <FaStar size={20} color={'#ffc107'} key={index} />
                                                ))}
                                            </p>
                                        </div>
                                    </div>
                                    <ReactTextMoreLess
                                        className={cx('rate-text')}
                                        collapsed={collapsed}
                                        text={rate?.content}
                                        lessHeight={72}
                                        onClick={(e) => {
                                            setState(!collapsed);
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </>
                ) : (
                    'Chưa có đánh giá nào'
                )}
            </div>
            {dataRate?.rates.length > 4 && <Button onClick={() => setOpen(true)}>Hiện thêm</Button>}
            <RateList data={dataRate} isOpen={isOpen} onCancel={onCancel} />
        </div>
    );
};

export default RatingSide;
