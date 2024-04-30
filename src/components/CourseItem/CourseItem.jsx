/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import styles from './CourseItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Image from '../Image/Image';
import { useCountCourseUserQuery } from '@/providers/apis/sttCourseApi';

const cx = classNames.bind(styles);
const CourseItem = ({ course }) => {
    const { data, isLoading } = useCountCourseUserQuery(course?._id);
    console.log();
    return (
        <Link to={`/detail/${course?._id}`}>
            <div className={cx('courses-newest_item')}>
                <Image src={course?.thumb} alt={course?.name} />

                <h4>{course?.name}</h4>
                <div className={cx('courses-newest_info')}>
                    <FontAwesomeIcon icon={faUsers} />
                    <span>{data?.count}</span>
                    {course?.price == 0 ? (
                        <p>Miễn phí</p>
                    ) : (
                        <div className={cx('price__wrapper')}>
                            <p className={cx('old__price')}>{course?.old_price.toLocaleString()}đ</p>
                            <p>{course?.price.toLocaleString()}đ</p>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default CourseItem;
