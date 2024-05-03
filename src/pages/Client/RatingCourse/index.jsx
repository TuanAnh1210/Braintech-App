import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import classNames from 'classnames/bind';
import styles from './RatingCourse.module.scss';

const RatingCourse = ({ onRatingChange }) => {
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);

    const cx = classNames.bind(styles);

    return (
        <div className={cx('ratingCourse')}>
            <h3 className={cx('ratingHeader')}>Đánh giá khoá học</h3>
            {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;

                return (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => {
                                setRating(ratingValue);
                                onRatingChange(ratingValue);
                            }}
                        />
                        <FaStar
                            className={cx('star')}
                            color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                            size={30}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(null)}
                        />
                    </label>
                );
            })}
            <p>Bạn đã đánh giá {rating} sao</p>
        </div>
    );
};

export default RatingCourse;
