import { Col, Container, Row } from 'react-bootstrap';
import classNames from 'classnames/bind';

import styles from './Courses.module.scss';
import Banner from '@/components/Banner/Banner';
import { base_banner } from '@/components/Banner/Base';

import images from '@/assets/images';
import CourseItem from '@/components/CourseItem/CourseItem';
import { useGetCoursesQuery as useGetCoursesteacherQuery } from '@/providers/apis/courseTeacherApi';
import { useGetCoursesQuery } from '@/providers/apis/courseApi';
import { useEffect } from 'react';

const cx = classNames.bind(styles);
const Courses = () => {
    const { data: listCoursesTeacher, refetch } = useGetCoursesteacherQuery();

    const { group } = images;
    useEffect(() => {
        refetch();
    }, [listCoursesTeacher]);
    return (
        <>
            <Banner {...base_banner.banner_course} />

            <div className={cx('courses__wrapper')}>
                <Container>
                    {listCoursesTeacher?.courses?.filter((course) => course?.cate_id?.code == 'pro').length === 0 ? (
                        <></>
                    ) : (
                        <h1>
                            Khóa học Pro <span className={cx('pro__label')}>Mới</span>
                        </h1>
                    )}

                    <Row data-course="1" className={cx('courseWrapper')}>
                        {listCoursesTeacher?.courses
                            ?.filter((course) => course?.cate_id?.code == 'pro')
                            ?.map((course) => (
                                <Col lg={3} md={4} key={course.id}>
                                    <CourseItem course={course} pro={true} />
                                </Col>
                            ))}
                    </Row>
                </Container>
            </div>
            <div className={cx('courses__wrapper')}>
                <Container>
                    {listCoursesTeacher?.courses?.filter((course) => course?.cate_id?.code == 'fe').length === 0 ? (
                        <></>
                    ) : (
                        <h1>Khóa học Front-End miễn phí</h1>
                    )}

                    <Row data-course="1" className={cx('courseWrapper')}>
                        {listCoursesTeacher?.courses
                            ?.filter((course) => course?.cate_id?.code == 'fe')
                            ?.map((course) => (
                                <Col lg={3} md={4} key={course.id}>
                                    <CourseItem course={course} />
                                </Col>
                            ))}
                    </Row>
                </Container>
            </div>
            <div className={cx('courses__wrapper')}>
                <Container>
                    {listCoursesTeacher?.courses?.filter((course) => course?.cate_id?.code == 'be').length === 0 ? (
                        <></>
                    ) : (
                        <h1>Khóa học Back-End miễn phí</h1>
                    )}

                    <Row data-course="1" className={cx('courseWrapper')}>
                        {listCoursesTeacher?.courses
                            ?.filter((course) => course?.cate_id?.code == 'be')
                            ?.map((course) => (
                                <Col lg={3} md={4} key={course.id}>
                                    <CourseItem course={course} />
                                </Col>
                            ))}
                    </Row>
                </Container>
            </div>
            <div className={cx('group')}>
                <Container>
                    <Row style={{ alignItems: 'center' }}>
                        <Col lg={7} md={7}>
                            <div className={cx('group__text')}>
                                <h3>Tham gia cộng đồng học viên BrainTech trên Facebook</h3>
                                <p>
                                    Hàng nghìn người khác đang học lộ trình giống như bạn. Hãy tham gia hỏi đáp, chia sẻ
                                    và hỗ trợ nhau trong quá trình học nhé.
                                </p>

                                <a href="https://www.facebook.com/groups/f8official">Tham gia nhóm</a>
                            </div>
                        </Col>
                        <Col lg={5} md={5}>
                            <div className={cx('group__img')}>
                                <img src={group} alt="" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default Courses;
