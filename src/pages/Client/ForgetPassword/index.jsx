import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { Button, notification, message, Form, Input } from 'antd';
import { useForgetPasswordMutation, useGetUsersQuery } from '@/providers/apis/userApi';
import OTPTimer from './time';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpSend, setOtpSend] = useState('');
    const [sent, setSent] = useState(false);
    const [check, setCheck] = useState(false);
    const { data: alluser } = useGetUsersQuery();
    const [handleUpdateUser] = useForgetPasswordMutation();
    const [expiryTime, setExpiryTime] = useState(null);
    const navigate = useNavigate()
    const [keyProp, setKeyProp] = useState(0);
    const emailUser = alluser?.data?.find(item => item.email === email)

    const sendOTPByEmail = async () => {
        try {
            if (!emailUser) {
                notification.error({
                    message: 'Error',
                    description: 'Vui lòng kiểm tra lại email!',
                });
                return;
            }
            const otp = generateOTP();
            const templateParams = {
                to_email: email,
                from_name: 'Braintech',
                to_name: emailUser?.full_name,
                otp: otp
            };

            await emailjs.send(
                'service_175oayh', // Service ID from EmailJS dashboard
                'template_t7y1quv', // Template ID from EmailJS dashboard
                templateParams,
                '7rLlUinu9U6ZvF6Ey' // User ID from EmailJS dashboard
            ).then((response) => {
                console.log('Email sent successfully:', response);
                setOtp(otp);
                const expiry = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now
                setExpiryTime(expiry);
            });

            setOtpSend(otp);
            setSent(true);

            message.success('Mã OTP sẽ được gửi qua email!');
        } catch (error) {
            console.error('Error sending OTP:', error);
            message.error('Không thể gửi mã OTP!');
        }
    };
    const checkOTP = (enteredOTP, storedOTP) => {
        return enteredOTP === storedOTP;
    };

    const verifyOTP = () => {
        const currentTime = new Date().getTime();
        if (currentTime > expiryTime) {
            setCheck(false)
            message.error('Mã OTP đã hết hạn , vui lòng nhấn nhận mã mới!');
            return;
        }
        if (otp === '') {
            message.error('Vui lòng nhập mã OTP!');
            return;
        }
        if (checkOTP(otp, otpSend)) {
            setCheck(true)
            setSent(false)
            message.success('Mã OTP hợp lệ!');
        } else {
            message.error('Mã OTP không hợp lệ!');
        }
        setKeyProp(prevKey => prevKey + 1);
    };

    const generateOTP = () => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    };
    const onFinish = async () => {
        if (newPassword !== confirmPassword) {
            notification.error({
                message: 'Error',
                description: 'Mật khẩu không khớp.',
            });
            return;
        }
        const userUpdate = {
            ...emailUser,
            phone: "Chưa cập nhật",
            password: newPassword,
            password_confirm: confirmPassword
        }
        handleUpdateUser(userUpdate).then(() => {
            setConfirmPassword('')
            setNewPassword('')
            setCheck(false)
            setSent(false)
            notification.success({
                message: 'Success',
                description: 'Mật khẩu đã được thay đổi thành công!.',
            });
            navigate('/')
        })

    };


    return (
        <body className='mt-[70px]'>


            <div style={{ textAlign: 'center' }} className='border-4 py-[100px] mt-[300px] bg-blue-100  rourded  w-[700px] rounded items-center m-auto'>
                {!check ? (
                    <>
                        <h2 className='mb-[25px] text-blue-400'>Nhập địa chỉ email</h2>
                        <Input
                            className='w-[300px] mb-[20px]'
                            placeholder="Nhập email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button type="primary" onClick={sendOTPByEmail} className='ml-[10px]'>
                            Lấy mã
                        </Button>
                    </>
                ) : (<>
                    <Form onFinish={onFinish} className='w-[300px] m-auto'>

                        <div className="mb-4">
                            <p className="mb-1 text-[20px] text-blue-400 font-semibold">Mật khẩu mới</p>
                            <Form.Item
                                name="password"
                                rules={[
                                    { whitespace: true, message: 'Vui lòng nhập mật khẩu!' },
                                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                                ]}
                            >
                                <Input type="password" className="w-100 p-2 rounded" placeholder="Mật khẩu" onChange={(e) => setNewPassword(e.target.value)} />
                            </Form.Item>
                        </div>
                        <div className="mb-4">
                            <p className="mb-1 text-[20px] text-blue-400 font-semibold">Xác nhận mật khẩu</p>
                            <Form.Item
                                name="password_confirm"
                                rules={[
                                    { whitespace: true, message: 'Vui lòng nhập mật khẩu xác nhận!' },
                                    { required: true, message: 'Vui lòng nhập mật khẩu xác nhận!' },
                                ]}
                            >
                                <Input type="password" className="w-100 p-2 rounded" placeholder="Nhập mật khẩu xác nhận" onChange={(e) => setConfirmPassword(e.target.value)} />
                            </Form.Item>
                        </div>
                        <Button htmlType="submit" className="w-100 " type="primary" size={'large'}>
                            Lưu
                        </Button>
                    </Form>
                </>)}

                {sent && (
                    <div style={{ marginTop: '20px' }}>
                        <Input
                            className='w-[300px]'
                            placeholder="Nhập mã OTP"
                            onChange={(e) => {
                                setOtp(e.target.value)
                            }}

                        />
                        <Button type="primary" style={{ marginLeft: '10px' }} onClick={verifyOTP} className='mb-[15px]'>
                            Kiểm tra
                        </Button>
                        <OTPTimer expiryTime={expiryTime} keyProp={keyProp} />

                    </div>
                )}

            </div>
        </body>
    );
};

export default ForgotPassword;
