import React, { useState } from 'react';
import { Form, Input, Button, Alert } from 'antd';
import { initializeApp } from "firebase/app";
import 'firebase/auth';
import nodemailer from 'nodemailer';
import nodemailerBrowser from 'nodemailer-browser';

import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
    window.Buffer = window.Buffer || Buffer;
}

const firebaseConfig = {
    apiKey: "AIzaSyDaXtlFUCrvYzF0yHQKG4F16t2R7EoF31I",
    authDomain: "braintech-66be7.firebaseapp.com",
    projectId: "braintech-66be7",
    storageBucket: "braintech-66be7.appspot.com",
    messagingSenderId: "1023954121782",
    appId: "1:1023954121782:web:f4ef5fcae32028eabd5497",
    measurementId: "G-47DNR1989T"
};

const app = initializeApp(firebaseConfig);

const ForgotPasswordForm = () => {
    const [form] = Form.useForm();
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const sendOTP = async (email) => {
        try {
            console.log(email);
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'vulinh20111999@gmail.com',
                    pass: "Linhlam99@"
                }
            })

            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const mailOptions = {
                from: 'vulinh20111999@gmail.com',
                to: email,
                subject: 'OTP Verification for Password Reset',
                text: `Your OTP is ${generatedOtp}`,
            };

            await transport.sendMail(mailOptions);

            setOtp(generatedOtp);
            setOtpSent(true);
            setSuccess('OTP sent to your email.');
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        }
    };

    const handleResetPassword = async (values) => {
        try {
            if (values.otp !== otp) {
                setError('Invalid OTP');
                return;
            }

            await firebase.auth().sendPasswordResetEmail(values.email);
            setSuccess('Password reset email sent.');
            setError('');
        } catch (err) {
            setError(err.message);
        }
    };

    const validateOtp = (rule, value, callback) => {
        if (value !== otp) {
            callback('Invalid OTP');
        } else {
            callback();
        }
    };

    return (
        <div>
            <h2>Forgot Password</h2>
            <Form form={form} onFinish={handleResetPassword}>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                {!otpSent ? (
                    <Form.Item>
                        <Button type="primary" onClick={() => sendOTP(form.getFieldValue('email'))}>
                            Send OTP
                        </Button>
                    </Form.Item>
                ) : (
                    <Form.Item
                        name="otp"
                        label="OTP"
                        rules={[
                            {
                                required: true,
                                message: 'Please input the OTP sent to your email!',
                            },
                            {
                                validator: validateOtp,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                )}

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Reset Password
                    </Button>
                </Form.Item>
            </Form>
            {error && <Alert message={error} type="error" showIcon />}
            {success && <Alert message={success} type="success" showIcon />}
        </div>
    );
};

export default ForgotPasswordForm;
