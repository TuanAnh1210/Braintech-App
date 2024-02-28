/* eslint-disable react/prop-types */
import { Button, Form, Input, Spin, notification } from 'antd';

import { useRegisterMutation } from '@/providers/apis/userApi';
import useLocalStorage from '@/hooks/useLocalStorage';

const Register = ({ setOpen }) => {
    const [, setAccessToken] = useLocalStorage('access_token', null);
    const [handleRegister, { isLoading }] = useRegisterMutation();

    const onFinish = async (value) => {
        const { data, error } = await handleRegister({
            ...value,
            auth_type: 'phone',
        });

        if (error) {
            return notification.error({
                message: 'Thông báo',
                description: error.data.message,
                duration: 1.75,
            });
        }

        notification.success({
            message: 'Thông báo',
            description: data.message,
            duration: 1.75,
        });

        setAccessToken({
            token: data.user.accessToken,
            email: data.user.email,
            fullName: data.user.fullName,
            avatar: data.user.avatar,
        });

        setOpen(false);
    };

    return (
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
                    name="account"
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
                    name="password_confirm"
                    rules={[
                        { whitespace: true, message: 'Vui lòng nhập mật khẩu xác nhận!' },
                        { required: true, message: 'Vui lòng nhập mật khẩu xác nhận!' },
                    ]}
                >
                    <Input type="password" className="w-100 p-2 rounded" placeholder="Nhập mật khẩu xác nhận" />
                </Form.Item>
            </div>
            <Button htmlType="submit" className="w-100 mt-4" type="primary" size={'large'}>
                {isLoading ? <Spin /> : 'Đăng ký'}
            </Button>
        </Form>
    );
};

export default Register;
