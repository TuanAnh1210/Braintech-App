import { Button, Modal } from 'antd';
import classNames from 'classnames/bind';
import React, { useEffect, useState } from 'react';
import styles from './DetailCourse.module.scss';
import { FaStar } from 'react-icons/fa6';

const cx = classNames.bind(styles);

const RateList = ({ isOpen, onCancel, data }) => {
    const dataRate = data?.rates;
    const [rate, setRate] = useState(dataRate);
    const dataClick = (value) => {
        const filterRating = data?.rates.filter((r) => r.rating == value);
        setRate(filterRating);
    };
    useEffect(() => {
        setRate(dataRate);
    }, [data]);
    return (
        <Modal open={isOpen} closable={true} onCancel={onCancel} centered={true} footer={false} width={1000}>
            <div>
                <h2>Đánh giá khóa học</h2>
                <div className={cx('more-rate-list')}>
                    <div className={cx('star-list flex m-2 gap-1')}>
                        <span className={cx('button-container')}>
                            <button
                                onClick={() => {
                                    dataClick('1');
                                }}
                            >
                                1 sao
                            </button>
                        </span>
                        <span className={cx('button-container')}>
                            <button
                                onClick={() => {
                                    dataClick('2');
                                }}
                            >
                                2 sao
                            </button>
                        </span>
                        <span className={cx('button-container')}>
                            <button
                                onClick={() => {
                                    dataClick('3');
                                }}
                            >
                                3 sao
                            </button>
                        </span>
                        <span className={cx('button-container')}>
                            <button
                                onClick={() => {
                                    dataClick('4');
                                }}
                            >
                                4 sao
                            </button>
                        </span>
                        <span className={cx('button-container')}>
                            <button
                                onClick={() => {
                                    dataClick('5');
                                }}
                            >
                                5 sao
                            </button>
                        </span>
                    </div>
                    <div className={cx('rate-list')}>
                        {rate?.length ? (
                            rate?.map((rate) => {
                                return (
                                    <div className={cx('card-rate')}>
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
                                        <p>{rate?.content}</p>
                                    </div>
                                );
                            })
                        ) : (
                            <p>Chưa có đánh giá nào</p>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default RateList;
