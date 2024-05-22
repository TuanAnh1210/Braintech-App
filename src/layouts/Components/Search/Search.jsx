import { Avatar, List } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { faCircleXmark, faMagnifyingGlass, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';

import styles from './Search.module.scss';
import { useGetCoursesQuery as useGetCoursesteacherQuery } from '@/providers/apis/courseTeacherApi';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);

function Search() {
    const { data: listCoursesTeacher } = useGetCoursesteacherQuery();

    const dataCourse = listCoursesTeacher?.courses?.map((item) => {
        return {
            id: item?._id,
            title: item?.name,
            avatar: item?.thumb,
            description: item?.description,
        };
    });

    const [courseSearch, setCourseSearch] = useState(dataCourse);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleInputFocus = () => {
        setIsInputFocused(true);
    };

    const handleUnfocus = () => {
        setIsInputFocused(false);
    };
    const handleSearch = (e) => {
        setIsInputFocused(true);
        const keyWord = e.target.value.toLowerCase();
        const newData = dataCourse?.filter(
            (item) => item.title.toLowerCase().includes(keyWord) || item.description.toLowerCase().includes(keyWord),
        );
        setCourseSearch(newData);
    };
    const handleLinkClick = (e) => {
        // Ngăn chặn sự kiện click lan truyền lên các phần tử cha
        setIsInputFocused(false);
    };
    return (
        <>
            <div className={cx('search')}>
                <input
                    onFocus={handleInputFocus}
                    placeholder="Tìm kiếm khóa học ..."
                    spellCheck={false}
                    onChange={handleSearch}
                />
                {/* 
              <button className={cx('clear')}>
                  <FontAwesomeIcon icon={faCircleXmark} />
              </button> */}
                <button className={cx('search-btn')} onMouseDown={(e) => e.preventDefault()}>
                    {isInputFocused ? (
                        <FontAwesomeIcon
                            icon={faSpinner}
                            spin
                            onClick={() => {
                                handleUnfocus();
                            }}
                        />
                    ) : (
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    )}
                </button>

                {isInputFocused && (
                    <List
                        className={cx('course_search')}
                        itemLayout="horizontal"
                        dataSource={courseSearch || dataCourse}
                        renderItem={(item, index) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={`${item.avatar}`} />}
                                    title={
                                        <Link to={`/detail/teacher/${item.id}`} onClick={handleLinkClick}>
                                            {item.title}
                                        </Link>
                                    }
                                    description={item.description}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </div>
        </>
    );
}

export default Search;
