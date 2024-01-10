import classNames from 'classnames/bind';
import { CgSun } from 'react-icons/cg';
import { FaGear, FaExpand, FaCompress, FaBell } from 'react-icons/fa6';
import { useState } from 'react';

import styles from './AdminHeader.module.scss';

const cx = classNames.bind(styles);

function AdminHeader() {
    const [fullScreen, setFullScreen] = useState(false);

    const handleFullScreen = () => {
        const eBody = document.documentElement;
        if (eBody.requestFullscreen) eBody.requestFullscreen();
        /* Safari */
        if (eBody.webkitRequestFullscreen) eBody.webkitRequestFullscreen();
        /* IE11 */
        if (eBody.msRequestFullscreen) eBody.msRequestFullscreen();
        setFullScreen(true);
    };

    const handleExitFullScreen = () => {
        if (document.exitFullscreen) document.exitFullscreen();
        /* Safari */
        if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        /* IE11 */
        if (document.msExitFullscreen) document.msExitFullscreen();
        setFullScreen(false);
    };

    return (
        <div className={cx('header')} style={{ height: '60px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4 6C4 5.44772 4.44772 5 5 5H19C19.5523 5 20 5.44772 20 6C20 6.55228 19.5523 7 19 7H5C4.44772 7 4 6.55228 4 6Z"
                    fill="#536485"
                />
                <path
                    d="M4 18C4 17.4477 4.44772 17 5 17H19C19.5523 17 20 17.4477 20 18C20 18.5523 19.5523 19 19 19H5C4.44772 19 4 18.5523 4 18Z"
                    fill="#536485"
                />
                <path
                    d="M5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13H13C13.5523 13 14 12.5523 14 12C14 11.4477 13.5523 11 13 11H5Z"
                    fill="#536485"
                />
            </svg>
            <div style={{ display: 'flex', alignItems: 'center', gap: '25px', color: '#536485', fontSize: '18px' }}>
                <CgSun className="" />

                <FaBell />
                <div onClick={() => (!fullScreen ? handleFullScreen() : handleExitFullScreen())}>
                    {!fullScreen ? <FaExpand /> : <FaCompress />}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                        width={30}
                        height={30}
                        style={{ borderRadius: '100%' }}
                        src="https://spruko.com/demo/ynex/dist/assets/images/faces/9.jpg"
                        alt=""
                    />
                    <div style={{ display: 'flex', alignItems: 'self-start', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600' }}>Juno Dev</span>
                        <span style={{ fontSize: '10px' }}>Web Developer</span>
                    </div>
                </div>
                <FaGear className={cx('spin')} />
            </div>
        </div>
    );
}

export default AdminHeader;
