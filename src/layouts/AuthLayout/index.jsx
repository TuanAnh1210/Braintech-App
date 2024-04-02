/* eslint-disable react/prop-types */
import { Modal } from 'antd';

import Register from '@/pages/Client/Register';
import Login from '@/pages/Client/Login';
import { useDispatch } from 'react-redux';
import images from '@/assets/images';
import { useSelector } from 'react-redux';
import { closeModal, openModal } from '@/providers/slices/modalSlice';
const AuthLayout = () => {
    const dispatch = useDispatch();
    const { isOpen, page } = useSelector((state) => state.modal);
    const handleSwitchForm = () => {
        dispatch(openModal(page === 'login' ? 'register' : 'login'));
    };
    console.log(isOpen, page);
    const onCancel = () => {
        dispatch(closeModal());
    };

    return (
        <Modal open={isOpen} onCancel={onCancel} closable={true} centered={true} footer={false}>
            <div className="px-4">
                <div className="d-flex align-items-center justify-content-center my-3">
                    <img width={56} className="rounded" src={images.logo} alt="Braintech" />
                </div>
                <div className="text-center">
                    <h3 className="mb-3" style={{ fontWeight: 600 }}>
                        {page === 'login' ? 'Đăng nhập' : 'Đăng ký'}
                        <span style={{ color: '#3dd6a3', marginLeft: '6px' }}>Brain</span>
                        <span style={{ color: '#6666ff' }}>Tech</span>
                    </h3>
                    <p className="mb-4" style={{ color: '#f33a58', fontWeight: 400 }}>
                        Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người sử dụng chung có thể sẽ bị
                        khóa.
                    </p>
                </div>

                {page === 'login' ? <Login /> : <Register />}

                <p className="text-center mt-4" style={{ fontWeight: 500 }}>
                    Bạn chưa có tài khoản?{' '}
                    <span onClick={handleSwitchForm} style={{ color: '#1677ff', cursor: 'pointer' }}>
                        {page === 'login' ? 'Đăng ký' : 'Đăng nhập'}
                    </span>
                </p>

                <div className="text-center my-3" style={{ fontSize: '12px' }}>
                    <span>Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với </span>
                    <a href="/" className="text-decoration-underline" target="_top">
                        điều khoản sử dụng
                    </a>
                    <span> của chúng tôi.</span>
                </div>
            </div>
        </Modal>
    );
};

export default AuthLayout;
