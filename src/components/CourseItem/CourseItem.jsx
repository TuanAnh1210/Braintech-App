/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

import Image from '../Image/Image';
import { useCountCourseUserQuery } from '@/providers/apis/sttCourseApi';

import styles from './CourseItem.module.scss';
import { useGetAllPaymentByUserQuery } from '@/providers/apis/paymentDetail';
import { jwtDecode } from 'jwt-decode';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
const cx = classNames.bind(styles);

const CourseItem = ({ course }) => {
    const { data, isLoading } = useCountCourseUserQuery(course?._id);
    const [userid, setUserid] = useState(null);

    const { data: coursePay, isLoading: coursePayLoading } = useGetAllPaymentByUserQuery();
    const dataBought =
        !coursePayLoading &&
        coursePay?.data?.find((s) => s.user_id === userid && s.course_id._id === course?._id && s.status === 'SUCCESS');
    console.log(dataBought);
    const [cookies, setCookie] = useCookies(['cookieLoginStudent']);
    const dataUser = cookies?.cookieLoginStudent;
    useEffect(() => {
        if (cookies.cookieLoginStudent) {
            const decode = jwtDecode(dataUser?.accessToken);
            setUserid(decode._id);
        } else {
            navigate('/');
        }
    }, [cookies]);
    return (
        <Link to={`/detail/${course?._id}`}>
            <div className={cx('courses-newest_item')}>
                <Image src={course?.thumb} alt={course?.name} />

                <h4>{course?.name}</h4>
                <div className={cx('courses-newest_info')}>
                    <FontAwesomeIcon icon={faUsers} />
                    <span>{data?.count}</span>
                    {course?.price == 0 || dataBought ? (
                        <p>{dataBought ? 'Đã mua' : 'Miễn phí'} </p>
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
