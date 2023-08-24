import classNames from 'classnames/bind';
import styles from './CourseItem.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Image from '../Image/Image';

const cx = classNames.bind(styles);
const CourseItem = () => {
    return (
        <Link to="">
            <div className={cx('courses-newest_item')}>
                <Image
                    src="https://res.cloudinary.com/dpjieqbsk/image/upload/v1681377441/braintech/ptvkhwcfsdeqm4pgvmib.png"
                    alt=""
                />

                <h4>ten khoa hoc</h4>
                <div className={cx('courses-newest_info')}>
                    <FontAwesomeIcon icon={faUsers} />
                    <span>123</span>
                    <div className={cx('price__wrapper')}>
                        <p className={cx('old__price')}>123đ</p>
                        <p>345đ</p>
                    </div>
                    {/* <p>Miễn phí</p> */}
                </div>
            </div>
        </Link>
    );
};

export default CourseItem;
