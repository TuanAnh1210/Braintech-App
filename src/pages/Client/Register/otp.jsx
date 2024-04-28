
/* eslint-disable react/prop-types */
import { Button, Input, Modal, Spin, message, notification } from 'antd';
import emailjs from 'emailjs-com';
import { useRegisterMutation } from '@/providers/apis/userApi';
import { closeModal, openModal } from '@/providers/slices/modalSlice';
import { useRef, useState, useEffect } from 'react';
import OTPTimer from './time';
import { RedoOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';

const Rss = ({ value }) => {
    console.log(value);
    const dispatch = useDispatch();
    const [handleRegister, { isLoading }] = useRegisterMutation();
    const [sent, setSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [keyProp, setKeyProp] = useState(0);
    const [expiryTime, setExpiryTime] = useState(null);
    const [otpSend, setOtpSend] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = async () => {
        setIsModalOpen(true);
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
            const expiry = Date.now() + 60000; // 60s from now
            setExpiryTime(expiry);
        });

        setOtpSend(otp);
        setSent(true);
        message.success('Mã OTP sẽ được gửi qua email!');
    };
    const handleOk = () => {
        setIsModalOpen(false);
    }
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const onRelay = async () => {
        try {
            setOtp('')
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
                const expiry = Date.now() + 60000 // 5 minutes from now
                setExpiryTime(expiry);
            });

            setOtpSend(otp);
            setSent(true);
            message.success('Mã OTP sẽ được gửi qua email!');
        } catch (error) {
            console.error('Error sending OTP:', error);
            message.error('Đăng ký lỗi!');
        }

    };
    const checkOTP = (enteredOTP, storedOTP) => {
        return enteredOTP === storedOTP;
    };
    const verifyOTP = () => {
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
            ...value,
            auth_type: 'email',
        }
        setKeyProp((prevKey) => prevKey + 1);
        handleRegister(accRe).then(() => {
            notification.success({
                message: 'Success',
                description: 'Đăng ký thành công!.',
            });
            setIsModalOpen(false);
            dispatch(closeModal());
        });
    };
    const generateOTP = () => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    };


    return (
        <div className=''>
            <>
                <Button type="primary" onClick={showModal}>
                    Lấy mã
                </Button>
                <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} maskClosable={false}>
                    <Input
                        className="w-[300px]"
                        placeholder="Nhập mã OTP"
                        defaultValue={otp}
                        onChange={(e) => {
                            setOtp(e.target.value)
                        }}
                    />
                    <Button type="primary" style={{ marginLeft: '10px' }} onClick={verifyOTP} className="mb-[15px]">
                        {isLoading ? <Spin /> : 'Kiểm tra'}
                    </Button>
                    <Button type="primary" style={{ marginLeft: '10px' }} onClick={onRelay} className="mb-[15px]" icon={<RedoOutlined />}> </Button>

                    <OTPTimer expiryTime={expiryTime} keyProp={keyProp} />
                </Modal>
            </>

        </div >
    );
}

export default Rss;
