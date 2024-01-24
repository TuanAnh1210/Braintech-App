import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss'


const cx = classNames.bind(styles);
const Dashboard = () => {

    return (
        <>
            <div className={cx(' body content bg-slate-900 pt-[60px] px-[30px] min-h-[950px] ')}>
                <div className={cx('container-fluid mb-[40px]')}>

                    <div className={cx('row ')}>
                        <div className={cx('grid grid-cols-4 gap-[20px]  ')}>
                            <div className={cx(' card-stats relative p-[5px]  ')}>
                                <div className={cx(' card-header-warning static   ')}>
                                    <div className={cx('card-icon bg-[#f5700c] absolute top-0 left-0  w-[86px] h-[86px] text-center ml-[20px] p-[25px] rounded ')}>
                                        <svg className={cx('text-white-500')} xmlns='http://www.w3.org/2000/svg' width='36' height='36' fill='white' class='bi bi-people-fill' viewBox='0 0 16 16'>
                                            <path d='M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5' />
                                        </svg>
                                    </div>
                                </div>
                                <div className={cx('bg-[#1f283e] h-[90%] mt-[20px] pt-[20px] rounded w-full')}>
                                    <div className={cx('ml-[65%]')}>
                                        <p className={cx('text-[#6c757d]')}>Học viên</p>
                                        <h3 className={cx('text-[#6c757d] ml-[65%]')}>
                                            0
                                        </h3>

                                    </div>
                                    <div className={cx('mt-[20px] mx-[20px]  border-t-2 border-[#6c757d] ')}>
                                        <div className={cx(' flex flex-row pt-[10px] text-center items-center')}>
                                            <svg xmlns='http://www.w3.org/2000/svg' height='16' width='20' viewBox='0 0 640 512' fill='#6c757d'><path d='M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z' /></svg>
                                            <a href='#pablo' className={cx('warning-link ml-[10px] text-[#6c757d] text-[15px]')}>Tổng học viên</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={cx(' card-stats relative p-[5px]  ')}>
                                <div className={cx(' card-header-warning static   ')}>
                                    <div className={cx('card-icon bg-[#288c6c] absolute top-0 left-0  w-[86px] h-[86px] text-center ml-[20px] p-[25px] rounded ')}>
                                        <svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' fill='white' class='bi bi-code' viewBox='0 0 16 16'>
                                            <path d='M5.854 4.854a.5.5 0 1 0-.708-.708l-3.5 3.5a.5.5 0 0 0 0 .708l3.5 3.5a.5.5 0 0 0 .708-.708L2.707 8zm4.292 0a.5.5 0 0 1 .708-.708l3.5 3.5a.5.5 0 0 1 0 .708l-3.5 3.5a.5.5 0 0 1-.708-.708L13.293 8z' />
                                        </svg>
                                    </div>
                                </div>
                                <div className={cx('bg-[#1f283e] h-[90%] mt-[20px] pt-[20px] rounded w-full')}>
                                    <div className={cx('ml-[65%]')}>
                                        <p className={cx('text-[#6c757d]')}>Front-End</p>
                                        <h3 className={cx('text-[#6c757d] ml-[65%]')}>
                                            0
                                        </h3>

                                    </div>
                                    <div className={cx('mt-[20px] mx-[20px]  border-t-2 border-[#6c757d] ')}>
                                        <div className={cx(' flex pt-[10px] items-center')}>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#6c757d' class='bi bi-clipboard-fill' viewBox='0 0 16 16'>
                                                <path fill-rule='evenodd' d='M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2' />
                                            </svg>
                                            <a href='#pablo' className={cx('warning-link ml-[10px] text-[#6c757d] text-[15px]')}>Tổng khóa học</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={cx(' card-stats relative p-[5px]  ')}>
                                <div className={cx(' card-header-warning static   ')}>
                                    <div className={cx('card-icon bg-[#d22824] absolute top-0 left-0  w-[86px] h-[86px] text-center ml-[20px] p-[25px] rounded ')}>
                                        <svg xmlns='http://www.w3.org/2000/svg' width='36' height='36' fill='white' class='bi bi-braces' viewBox='0 0 16 16'>
                                            <path d='M2.114 8.063V7.9c1.005-.102 1.497-.615 1.497-1.6V4.503c0-1.094.39-1.538 1.354-1.538h.273V2h-.376C3.25 2 2.49 2.759 2.49 4.352v1.524c0 1.094-.376 1.456-1.49 1.456v1.299c1.114 0 1.49.362 1.49 1.456v1.524c0 1.593.759 2.352 2.372 2.352h.376v-.964h-.273c-.964 0-1.354-.444-1.354-1.538V9.663c0-.984-.492-1.497-1.497-1.6M13.886 7.9v.163c-1.005.103-1.497.616-1.497 1.6v1.798c0 1.094-.39 1.538-1.354 1.538h-.273v.964h.376c1.613 0 2.372-.759 2.372-2.352v-1.524c0-1.094.376-1.456 1.49-1.456V7.332c-1.114 0-1.49-.362-1.49-1.456V4.352C13.51 2.759 12.75 2 11.138 2h-.376v.964h.273c.964 0 1.354.444 1.354 1.538V6.3c0 .984.492 1.497 1.497 1.6' />
                                        </svg>
                                    </div>
                                </div>
                                <div className={cx('bg-[#1f283e] h-[90%] mt-[20px] pt-[20px] rounded w-full')}>
                                    <div className={cx('ml-[65%]')}>
                                        <p className={cx('text-[#6c757d]')}>Back-End</p>
                                        <h3 className={cx('text-[#6c757d] ml-[65%]')}>
                                            0
                                        </h3>

                                    </div>
                                    <div className={cx('mt-[20px] mx-[20px]  border-t-2 border-[#6c757d] ')}>
                                        <div className={cx(' flex pt-[10px] items-center')}>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#6c757d' class='bi bi-clipboard-fill' viewBox='0 0 16 16'>
                                                <path fill-rule='evenodd' d='M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2' />
                                            </svg>
                                            <a href='#pablo' className={cx('warning-link ml-[10px] text-[#6c757d] text-[15px]')}>Tổng khóa học</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={cx(' card-stats relative p-[5px]  ')}>
                                <div className={cx(' card-header-warning static   ')}>
                                    <div className={cx('card-icon bg-[#029eb1] absolute top-0 left-0  w-[86px] h-[86px] text-center ml-[20px] p-[25px] rounded ')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="white" class="bi bi-file-code" viewBox="0 0 16 16">
                                            <path d="M6.646 5.646a.5.5 0 1 1 .708.708L5.707 8l1.647 1.646a.5.5 0 0 1-.708.708l-2-2a.5.5 0 0 1 0-.708zm2.708 0a.5.5 0 1 0-.708.708L10.293 8 8.646 9.646a.5.5 0 0 0 .708.708l2-2a.5.5 0 0 0 0-.708z" />
                                            <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1" />
                                        </svg>
                                    </div>
                                </div>
                                <div className={cx('bg-[#1f283e] h-[90%] mt-[20px] pt-[20px] rounded w-full')}>
                                    <div className={cx('ml-[65%]')}>
                                        <p className={cx('text-[#6c757d]')}>Khóa Pro</p>
                                        <h3 className={cx('text-[#6c757d] ml-[65%]')}>
                                            0
                                        </h3>

                                    </div>
                                    <div className={cx('mt-[20px] mx-[20px]  border-t-2 border-[#6c757d] ')}>
                                        <div className={cx(' flex pt-[10px] items-center')}>
                                            <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#6c757d' class='bi bi-clipboard-fill' viewBox='0 0 16 16'>
                                                <path fill-rule='evenodd' d='M10 1.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm-5 0A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5v1A1.5 1.5 0 0 1 9.5 4h-3A1.5 1.5 0 0 1 5 2.5zm-2 0h1v1A2.5 2.5 0 0 0 6.5 5h3A2.5 2.5 0 0 0 12 2.5v-1h1a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V3.5a2 2 0 0 1 2-2' />
                                            </svg>
                                            <a href='#pablo' className={cx('warning-link ml-[10px] text-[#6c757d] text-[15px]')}>Tổng khóa học</a>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>

                    </div>
                </div>
                <div className={cx(' card-stats relative p-[5px] mt-[100px] ')}>
                    <div className={cx(' card-header-warning static   ')}>
                        <div className={cx('card-icon bg-[#7b1fa2] absolute top-0 left-0  w-[95%] h-[86px] ml-[30px] p-[15px] rounded ')}>
                            <h4 className={cx('card-title text-white')}>Doanh thu năm 2023</h4>
                            <p className={cx('card-category text-white')}> Tổng doanh thu: <strong

                                className={cx('totalRevenue test2')}></strong></p>
                        </div>
                    </div>
                    <div className={cx('bg-[#1f283e] mt-[30px] pt-[80px] rounded w-full')}>
                        <div className={cx('px-[30px] ')}>
                            <table className={cx('border-separate border-spacing-2 text-center text-[#6c757d] ')}>
                                <thead className={cx('text-[#6c757d] h-[50px]')}>
                                    <th width='5%' >
                                        ID
                                    </th>
                                    <th width='33%'>
                                        Khóa học
                                    </th>
                                    <th width='20%'>
                                        Số lượng bán
                                    </th>

                                    <th width='35%'>
                                        Giá
                                    </th>
                                    <th width='35%'>
                                        Tổng
                                    </th>
                                </thead>

                                <tbody >
                                    <tr className={cx('mt-[40px] h-[50px]')}>
                                        <td>1</td>
                                        <td>Font-End</td>
                                        <td>5</td>
                                        <td>10000000</td>
                                        <td>500000000</td>
                                    </tr>
                                    <tr className={cx('mt-[40px] h-[50px]  ')}>
                                        <td>1</td>
                                        <td>Font-End</td>
                                        <td>5</td>
                                        <td>10000000</td>
                                        <td>500000000</td>
                                    </tr>
                                    <tr className={cx('mt-[40px] h-[50px]  ')}>
                                        <td>1</td>
                                        <td>Font-End</td>
                                        <td>5</td>
                                        <td>10000000</td>
                                        <td>500000000</td>
                                    </tr>
                                    <tr className={cx('mt-[40px] h-[50px]  ')}>
                                        <td>1</td>
                                        <td>Font-End</td>
                                        <td>5</td>
                                        <td>10000000</td>
                                        <td>500000000</td>
                                    </tr>
                                    <tr className={cx('mt-[40px] h-[50px]  ')}>
                                        <td>1</td>
                                        <td>Font-End</td>
                                        <td>5</td>
                                        <td>10000000</td>
                                        <td>500000000</td>
                                    </tr>
                                    <tr className={cx('mt-[40px] h-[50px]  ')}>
                                        <td>1</td>
                                        <td>Font-End</td>
                                        <td>5</td>
                                        <td>10000000</td>
                                        <td>500000000</td>
                                    </tr>
                                    <tr className={cx('mt-[40px] h-[50px]  ')}>
                                        <td>1</td>
                                        <td>Font-End</td>
                                        <td>5</td>
                                        <td>10000000</td>
                                        <td>500000000</td>
                                    </tr>


                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>

            </div>

        </>
    );
}

export default Dashboard