/* eslint-disable react/prop-types */
import { Button, Form, Input, Spin, message, notification } from 'antd';
import emailjs from 'emailjs-com';
import { useLoginMutation, useRegisterMutation } from '@/providers/apis/userApi';
import useLocalStorage from '@/hooks/useLocalStorage';
import { closeModal } from '@/providers/slices/modalSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import OTPTimer from './time';
import { RedoOutlined } from '@ant-design/icons';
import { useCookies } from 'react-cookie';
import { login } from '@/providers/slices/userSlice';

const Register = () => {
    const [handleLogin] = useLoginMutation();
    const [, setCookie] = useCookies(['cookieLoginStudent']);
    const [, setAccessToken] = useLocalStorage('access_token', null);
    const [handleRegister, { isLoading }] = useRegisterMutation();
    const dispatch = useDispatch();
    const [sent, setSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [acc, setAcc] = useState('');
    const [keyProp, setKeyProp] = useState(0);
    const [expiryTime, setExpiryTime] = useState(null);
    const [otpRelay, setOtpRelay] = useState({});
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpSend, setOtpSend] = useState('');

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
            const otp = generateOTP();
            const templateParams = {
                to_email: value.account,
                from_name: 'Braintech',
                to_name: value.full_name,
                otp: otp,
            };

            await emailjs.send(
                'service_q0lye59', // Service ID from EmailJS dashboard
                'template_vyebfac', // Template ID from EmailJS dashboard
                templateParams,
                'TWJepBKsA2PD3FjQd' // User ID from EmailJS dashboard
            ).then((response) => {
                console.log('Email sent successfully:', response);
                const expiry = Date.now() + 30000; // 5 minutes from now
                setExpiryTime(expiry);
            });

            setOtpSend(otp);
            setSent(true);
            setAcc(value)
            message.success('Mã OTP sẽ được gửi qua email!');
        } catch (error) {
            console.error('Error sending OTP:', error);
            message.error('Đăng ký lỗi!');
        }

    };
    const onRelay = async () => {
        try {
            setOtp('')
            const otp = generateOTP();
            const templateParams = {
                to_email: otpRelay.account,
                from_name: 'Braintech',
                to_name: otpRelay.full_name,
                otp: otp,
            };

            await emailjs.send(
                'service_q0lye59', // Service ID from EmailJS dashboard
                'template_vyebfac', // Template ID from EmailJS dashboard
                templateParams,
                'TWJepBKsA2PD3FjQd' // User ID from EmailJS dashboard
            ).then((response) => {
                console.log('Email sent successfully:', response);
                const expiry = Date.now() + 30000; // 5 minutes from now
                setExpiryTime(expiry);
            });

            setOtpSend(otp);
            setSent(true);
            setAcc(otpRelay)
            message.success('Mã OTP sẽ được gửi qua email!');
        } catch (error) {
            console.error('Error sending OTP:', error);
            message.error('Đăng ký lỗi!');
        }

    };
    const checkOTP = (enteredOTP, storedOTP) => {
        return enteredOTP === storedOTP;
    };
    const verifyOTP = async () => {
        const currentTime = new Date().getTime();
        if (currentTime > expiryTime) {
            console.log('hết hạn');
            setOtpSend('')
            message.error('Mã OTP đã hết hạn , vui lòng nhấn nhận mã mới!');
            return;
        }
        if (otp === '') {
            message.error('Vui lòng nhập mã OTP!');
            return;
        }
        if (checkOTP(otp, otpSend)) {
            setSent(false);
        } else {
            message.error('Mã OTP không hợp lệ!');
        }
        const accRe = {
            ...acc,
            auth_type: 'email',
        }
        setKeyProp((prevKey) => prevKey + 1);
        handleRegister(accRe).then(async () => {
            notification.success({
                message: 'Success',
                description: 'Đăng ký thành công!.',
            });

            const { data, error } = await handleLogin({
                account: accRe.account,
                password: accRe.password,
                auth_type: 'email',
            });
            if (data) {
                setCookie('cookieLoginStudent', JSON.stringify(data.user), { path: '/', domain: 'localhost' });
            }

            if (error) {
                return notification.error({
                    message: 'Thông báo',
                    description: error.data.message,
                    duration: 1.75,
                });
            }

            const user = {
                token: data.user.accessToken,
                email: data.user.email,
                phone: data.user.phone,
                fullName: data.user.fullName,
                avatar: data.user.avatar,
            };


            dispatch(login(user));

            dispatch(closeModal());
            if (data.user.isAdmin | data.user.isTeacher) {
                // navigate('http://localhost:5173/dashboard');
                window.location.href = 'http://localhost:5173/dashboard';
            }
        });


    };
    const generateOTP = () => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    };

    return (
        <>
            {sent === false ? (<Form onFinish={onFinish} autoComplete="off">
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
                <div className="mb-4">

                    <Form.Item
                        name="isAdmin"
                        hidden
                    >
                        <Input className="w-100 p-2 rounded" defaultValue={false} />
                    </Form.Item>
                </div>
                <div className="mb-4">

                    <Form.Item
                        name="isTeacher"
                        hidden
                    >
                        <Input className="w-100 p-2 rounded" defaultValue={false} />
                    </Form.Item>
                </div>

                <Button htmlType="submit" className="w-100 mt-4" type="primary" size={'large'}>
                    {isLoading ? <Spin /> : 'Đăng ký'}
                </Button>
            </Form>) : (
                <div style={{ marginTop: '20px' }} >
                    <div className='flex mb-[10px]'>
                        <Input
                            className="w-[300px]"
                            placeholder="Nhập mã OTP"
                            defaultValue={otp}
                            onChange={(e) => {
                                setOtp(e.target.value);
                            }}
                        />
                        <Button type="primary" style={{ marginLeft: '10px' }} onClick={verifyOTP} className="mb-[15px]">
                            Kiểm tra
                        </Button>
                        <Button type="primary" style={{ marginLeft: '10px' }} onClick={onRelay} className="mb-[15px]" icon={<RedoOutlined />}> </Button>
                    </div>
                    <OTPTimer expiryTime={expiryTime} keyProp={keyProp} />
                </div>
            )}

        </>



    );
};

export default Register;
