import classNames from 'classnames/bind';

import styles from './AdminFooter.module.scss';

const cx = classNames.bind(styles);

function AdminFooter() {
    return (
        <div className={cx('footer')}>
            <div className="text-center">
                <p className="text-black">
                    © Copyright 2024. Made with <span className="text-danger">❤</span> by{' '}
                    <span style={{ color: '#845adf', fontWeight: 500 }}>BrainTech</span>
                </p>
            </div>
        </div>
    );
}

export default AdminFooter;
