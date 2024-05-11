/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import Image from '../Image/Image';
import { useCountCourseUserQuery } from '@/providers/apis/sttCourseApi';

import styles from './CourseItem.module.scss';
import { useGetAllPaymentByUserQuery } from '@/providers/apis/paymentDetail';
const cx = classNames.bind(styles);

const CourseItemTeacher = ({ course }) => {
    const { data, isLoading } = useCountCourseUserQuery(course?._id);
    console.log(data);

    const { data: coursePay, isLoading: coursePayLoading, refetch } = useGetAllPaymentByUserQuery();
    const dataBought =
        !coursePayLoading && coursePay?.data?.find((s) => s?.course_id?._id === course?._id && s?.status === 'SUCCESS');


    return (
        <Link to={`/detail/teacher/${course?._id}`}>
            <div className={cx('courses-newest_item')}>
                <Image src={course?.thumb} alt={course?.name} />

                <h4>{course?.name}</h4>
                <div className={cx('courses-newest_info')}>
                    <FontAwesomeIcon icon={faUsers} />

                    {isLoading ? 'Loading...' : <span>{data?.count}</span>}
                    {course?.price == 0 || dataBought ? (
                        <p>{dataBought ? 'Đã mua' : 'Miễn phí'} </p>
                    ) : (
                        <div className={cx('price__wrapper')}>
                            <p className={cx('old__price')}>{course?.old_price.toLocaleString()}đ</p>
                            <p>{course?.price.toLocaleString()}đ</p>
                        </div>
                    )}
                    <p>Giảng viên : {course?.teacherId?.map(role => role.full_name).join('      &     ')} </p>
                </div>
            </div>
        </Link>
    );
};

export default CourseItemTeacher;
