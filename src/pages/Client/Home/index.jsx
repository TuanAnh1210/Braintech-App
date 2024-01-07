import classNames from 'classnames/bind';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styles from './Home.module.scss';
import Banner from '@/components/Banner/Banner';
import { base_banner } from '@/components/Banner/Base';
import { Col, Container, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faAngleLeft,
    faAngleRight,
    faCalendarDays,
    faNoteSticky,
    faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import BannerCard from './components/BannerCard';
import images from '@/assets/images';

import { useRef } from 'react';
import CourseItem from '@/components/CourseItem/CourseItem';
import { useGetCoursesQuery } from '@/providers/apis/courseApi';

const cx = classNames.bind(styles);

const Home = () => {
    const { data: listCourses, isLoading, isFetching, isError } = useGetCoursesQuery();

    const { html, css, intern, js, node, react, fe, be, bg, group } = images;
    const infos = [
        {
            title: 'Ghi chú dễ dàng',
            description: 'Ghi chú dễ dàng, nhanh chóng ngay tại nội dung bài học',
            icon: <FontAwesomeIcon icon={faNoteSticky} />,
        },
        {
            title: 'Lộ trình rõ ràng',
            description: 'Lộ trình được nghiên cứu và sắp xếp bởi các thầy cô có nhiều kinh nghiệm',
            icon: <FontAwesomeIcon icon={faCalendarDays} />,
        },
        {
            title: 'Nội dung chất lượng',
            description: 'Nội dung và chất lượng được đảm bảo bới các chuyên gia',
            icon: <FontAwesomeIcon icon={faUserShield} />,
        },
    ];

    const roadmaps = [
        {
            title: 'Lộ trình học Front-end',
            thumb: fe,
            description:
                'Lập trình viên Front-end là người xây dựng ra giao diện websites. Trong phần này BrainTech sẽ chia sẻ cho bạn lộ trình để trở thành lập trình viên Front-end nhé.',
            images: [intern, html, css, js, react],
        },
        {
            title: 'Lộ trình học Back-end',
            thumb: be,
            description:
                'Trái với Front-end thì lập trình viên Back-end là người làm việc với dữ liệu, công việc thường nặng tính logic hơn. Chúng ta sẽ cùng tìm hiểu thêm về lộ trình học Back-end nhé.',
            images: [intern, html, css, js, node],
        },
    ];

    // handle next , pre slider
    const sliderRef = useRef(null);

    const handleNext = () => {
        sliderRef.current.slickNext();
    };

    const handlePrevious = () => {
        sliderRef.current.slickPrev();
    };

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 992, // Kích thước màn hình từ 768px trở xuống
                settings: {
                    slidesToShow: 3, // Hiển thị 2 slide trên một hàng
                },
            },
            {
                breakpoint: 576, // Kích thước màn hình từ 480px trở xuống
                settings: {
                    slidesToShow: 1, // Hiển thị 1 slide trên một hàng
                },
            },
        ],
    };

    return (
        <>
            <Banner {...base_banner.banner_home} />
            <div className="banner__bottom">
                <Container>
                    <div className="sub__banner">
                        {infos.map((infos, index) => (
                            <BannerCard key={index} {...infos} />
                        ))}
                    </div>

                    {/* <div className="courses-newest">
                        <h2>Khóa học mới nhất</h2>
                        <div className="courses-newest_list owl-carousel owl-theme"></div>
                    </div> */}
                </Container>
            </div>
            <div className={cx('courses-newest')}>
                <h2>Khóa học mới nhất</h2>
                <Slider ref={sliderRef} {...settings} className={cx('courses-newest_list')}>
                    {listCourses?.courses?.slice(0, 5)?.map((course) => (
                        <CourseItem key={course.id} course={course} />
                    ))}
                </Slider>
                <div className={cx('courses-action')}>
                    <button onClick={handlePrevious}>
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                    <button onClick={handleNext}>
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                </div>
            </div>
            <div className={cx('roadmap')}>
                <Container>
                    <h2 className={cx('roadmap__card-info-title')}>Lộ trình học</h2>
                    <p className={cx('roadmap__card-info-sub')}>
                        Để bắt đầu một cách thuận lợi, bạn nên tập trung vào một lộ trình học. Ví dụ: Để đi làm với vị
                        trí “Lập trình viên Front-end” bạn nên tập trung vào lộ trình “Front-end”.
                    </p>

                    <Row>
                        {roadmaps.map((roadmap, index) => (
                            <Col key={index} lg={6} md={6}>
                                <div className={cx('roadmap__card')}>
                                    <div className={cx('roadmap__card-info')}>
                                        <h2>{roadmap.title}</h2>
                                        <p>{roadmap.description}</p>
                                        <div className={cx('learning__item')}>
                                            {roadmap.images.map((image, index) => (
                                                <div key={index} className={cx('learning__item-icon')}>
                                                    <img src={image} alt="" />
                                                </div>
                                            ))}
                                        </div>
                                        <button className={cx('btn_learn')}>Học ngay</button>
                                    </div>
                                    <div className={cx('roadmap__card-img')}>
                                        <div className={cx('roadmap__img-border')}>
                                            <img src={roadmap.thumb} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
            <div
                className={cx('people')}
                style={{
                    background: `url(${bg}) center center / cover no-repeat`,
                }}
            >
                <div className={cx('overlay-people')}></div>
                <h1>100.000+</h1>
                <h4>Học viên</h4>
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

export default Home;
