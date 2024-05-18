import { Avatar, List } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { faCircleXmark, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';

import styles from './Search.module.scss';
import { useGetCoursesQuery as useGetCoursesteacherQuery } from '@/providers/apis/courseTeacherApi';

const cx = classNames.bind(styles);

function Search() {
    const { data: listCoursesTeacher } = useGetCoursesteacherQuery();

    const dataCourse = listCoursesTeacher?.courses?.map((item) => {
        return {
            title: item?.name,
            avatar: item?.thumb,
            description: item?.description,
        };
    });

    console.log(dataCourse, 'data');
    const [courseSearch, setCourseSearch] = useState(dataCourse);
    console.log(courseSearch, 'courseSearch');

    const handleSearch = (e) => {
        const keyWord = e.target.value.toLowerCase();
        console.log(keyWord);
        const newData = dataCourse?.filter(
            (item) => item.title.toLowerCase().includes(keyWord) || item.description.toLowerCase().includes(keyWord),
        );
        setCourseSearch(newData);
    };

    return (
        <>
            <div className={cx('search')}>
                <input placeholder="Tìm kiếm khóa học ..." spellCheck={false} onChange={handleSearch} />
                {/* 
              <button className={cx('clear')}>
                  <FontAwesomeIcon icon={faCircleXmark} />
              </button> */}
                <button className={cx('search-btn')} onMouseDown={(e) => e.preventDefault()}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>

                <List
                    className={cx('course_search')}
                    itemLayout="horizontal"
                    dataSource={courseSearch || dataCourse}
                    renderItem={(item, index) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={`${item.avatar}`} />}
                                title={<a href="https://ant.design">{item.title}</a>}
                                description={item.description}
                            />
                        </List.Item>
                    )}
                />
            </div>
        </>
    );
}

export default Search;
