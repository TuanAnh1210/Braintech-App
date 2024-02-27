import classNames from 'classnames/bind';
import { Button as ButtonPrimary, Form, Input, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import Button from '../../../components/Button/Button';
import styles from './Register.module.scss';

const cx = classNames.bind(styles);

const Register = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onFinish = (value) => {
        console.log(value);
    };

    const onCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <Button outline onClick={() => setIsModalOpen(true)} className={cx('btn-register')}>
                Đăng ký
            </Button>
            <Modal open={isModalOpen} onCancel={onCancel} closable={true} footer={false}>
                <div className={cx('container')}>
                    <div className="d-flex align-items-center justify-content-center my-3">
                        <img width={56} className="rounded" src="/src/assets/images/logo.png" alt="Braintech" />
                    </div>
                    <div className="text-center">
                        <h3 className="mb-3" style={{ fontWeight: 600 }}>
                            Đăng ký
                            <span style={{ color: '#3dd6a3', marginLeft: '6px' }}>Brain</span>
                            <span style={{ color: '#6666ff' }}>Tech</span>
                        </h3>
                        <p className="mb-4" style={{ color: '#f33a58', fontWeight: 500 }}>
                            Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều người sử dụng chung có thể sẽ bị
                            khóa.
                        </p>
                    </div>
                    <Form onFinish={onFinish} autoComplete="off">
                        <div className="mb-4">
                            <p className="mb-1">Họ và tên</p>
                            <Form.Item
                                name="full_name"
                                rules={[
                                    { whitespace: true, message: 'Vui lòng nhập họ và tên!' },
                                    { required: true, message: 'Vui lòng nhập họ và tên!' },
                                ]}
                            >
                                <Input className="w-100 p-2 rounded" placeholder="Họ và tên" />
                            </Form.Item>
                        </div>
                        <div className="mb-4">
                            <p className="mb-1">Số điện thoại</p>
                            <Form.Item
                                name="phone_number"
                                rules={[
                                    { whitespace: true, message: 'Vui lòng nhập số điện thoại!' },
                                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                                ]}
                            >
                                <Input className="w-100 p-2 rounded" placeholder="Số điện thoại" />
                            </Form.Item>
                        </div>
                        <div className="mb-4">
                            <p className="mb-1">Mật khẩu</p>
                            <Form.Item
                                name="password"
                                rules={[
                                    { whitespace: true, message: 'Vui lòng nhập mật khẩu!' },
                                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                ]}
                            >
                                <Input type="password" className="w-100 p-2 rounded" placeholder="Mật khẩu" />
                            </Form.Item>
                        </div>
                        <div className="mb-4">
                            <p className="mb-1">Xác nhận mật khẩu</p>
                            <Form.Item
                                name="re_password"
                                rules={[
                                    { whitespace: true, message: 'Vui lòng nhập mật khẩu xác nhận!' },
                                    { required: true, message: 'Vui lòng nhập mật khẩu xác nhận!' },
                                ]}
                            >
                                <Input
                                    type="password"
                                    className="w-100 p-2 rounded"
                                    placeholder="Nhập mật khẩu xác nhận"
                                />
                            </Form.Item>
                        </div>
                        <ButtonPrimary htmlType="submit" className="w-100 mt-4" type="primary" size={'large'}>
                            Đăng ký
                        </ButtonPrimary>
                    </Form>
                    <p className="text-center mt-5" style={{ fontWeight: 500 }}>
                        Bạn đã có tài khoản?{' '}
                        <Link to={'/login'} style={{ color: '#1677ff' }}>
                            Đăng nhập
                        </Link>
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
        </>
    );
};

export default Register;
