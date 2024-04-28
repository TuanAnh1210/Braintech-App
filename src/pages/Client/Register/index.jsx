/* eslint-disable react/prop-types */
import { Button, Form, Input, Modal, Spin, message, notification } from 'antd';
import emailjs from 'emailjs-com';
import { useRegisterMutation } from '@/providers/apis/userApi';
import useLocalStorage from '@/hooks/useLocalStorage';
import { closeModal, openModal } from '@/providers/slices/modalSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import OTPTimer from './time';
import { RedoOutlined } from '@ant-design/icons';
import Rss from './otp';

const Register = () => {
    const [, setAccessToken] = useLocalStorage('access_token', null);
    const [handleRegister, { isLoading }] = useRegisterMutation();
    const [otpSend, setOtpSend] = useState('');
    const [sent, setSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpRelay, setOtpRelay] = useState({});

    const onFinish = async (value) => {

        try {
            setOtp('')
            setOtpRelay({
                full_name: value.full_name,
                account: value.account,
                password: value.password,
                password_confirm: value.password_confirm
            })
            if (value.password !== value.password_confirm) {
                return notification.error({
                    message: 'Thông báo',
                    description: "Mật khẩu không khớp",
                    duration: 1.75,
                });
            }
            setOtpSend(otp);
            setSent(true);
            console.log(value);
        } catch (error) {
            console.error('Error sending OTP:', error);
            message.error('Đăng ký lỗi!');
        }

    };

    return (
        <>
            {sent === false ? (
                <div >
                    <Form onFinish={onFinish} autoComplete="off" >
                        <div className="mb-4" >
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
                            <p className="mb-1">Email</p>
                            <Form.Item
                                name="account"
                                rules={[
                                    { whitespace: true, message: 'Vui lòng nhập email!' },
                                    { required: true, message: 'Vui lòng nhập email!' },
                                    {
                                        type: 'email',
                                        message: 'Vui lòng nhập đúng định dạng email!',
                                    }
                                ]}
                            >
                                <Input type='email' className="w-100 p-2 rounded" placeholder="Email" />
                            </Form.Item>
                        </div>
                        <div className="mb-4">
                            <p className="mb-1">Mật khẩu</p>
                            <Form.Item
                                name="password"
                                rules={[
                                    { whitespace: true, message: 'Vui lòng nhập mật khẩu!' },
                                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                    { min: 6, message: "Mật khẩu phải chứa ít nhất 6 ký tự" }
                                ]}
                            >
                                <Input type="password" className="w-100 p-2 rounded" placeholder="Mật khẩu" />
                            </Form.Item>
                        </div>
                        <div className="mb-4">
                            <p className="mb-1">Xác nhận mật khẩu</p>
                            <Form.Item
                                name="password_confirm"
                                rules={[
                                    { whitespace: true, message: 'Vui lòng nhập mật khẩu xác nhận!' },
                                    { required: true, message: 'Vui lòng nhập mật khẩu xác nhận!' },
                                ]}
                            >
                                <Input type="password" className="w-100 p-2 rounded" placeholder="Nhập mật khẩu xác nhận" />
                            </Form.Item>
                        </div>

                        <Button htmlType="submit" className="w-100 mt-4" type="primary" size={'large'} >
                            {isLoading ? <Spin /> : 'Đăng ký'}
                        </Button>
                    </Form>

                </div>
            ) : (
                <div>
                    <Rss value={otpRelay} />
                </div>
            )}


        </>



    );
};

export default Register;

