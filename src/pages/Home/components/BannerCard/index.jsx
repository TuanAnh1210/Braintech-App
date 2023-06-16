/* eslint-disable react/prop-types */
import classNames from 'classnames/bind';
import styles from './BannerCard.module.scss';

const cx = classNames.bind(styles);
const BannerCard = ({ title, description, icon }) => {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('icon')}>{icon}</div>
            <div className={cx('text')}>
                <h4>{title}</h4>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default BannerCard;
