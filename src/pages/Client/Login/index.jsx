/* eslint-disable react/prop-types */
import { Button, Form, Input, Spin, notification } from 'antd';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { useLoginMutation } from '@/providers/apis/userApi';
import useLocalStorage from '@/hooks/useLocalStorage';
import { login } from '@/providers/slices/userSlice';
import { closeModal } from '@/providers/slices/modalSlice';
import { openModal } from '@/providers/slices/modalSlice';

const Login = () => {
    const dispatch = useDispatch();
    const handleOpenModal = (page) => {
        dispatch(openModal(page));
    };
    const [, setAccessToken] = useLocalStorage('access_token', null);
    const [handleLogin, { isLoading }] = useLoginMutation();

    const onFinish = async (value) => {
        const { data, error } = await handleLogin({
            ...value,
            auth_type: 'email',
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

        const user = {
            token: data.user.accessToken,
            email: data.user.email,
            phone: data.user.phone,
            fullName: data.user.fullName,
            avatar: data.user.avatar,
        };

        setAccessToken(user);
        dispatch(login(user));

        dispatch(closeModal());
    };

    return (
        <Form onFinish={onFinish} autoComplete="off">
            <div className="mb-4">
                <p className="mb-1">Email</p>
                <Form.Item
                    name="account"
                    rules={[
                        { whitespace: true, message: 'Vui lòng nhập email!' },
                        { required: true, message: 'Vui lòng nhập email!' },
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
                    ]}
                >
                    <Input type="password" className="w-100 p-2 rounded" placeholder="Mật khẩu" />
                </Form.Item>
            </div>

            <Button htmlType="submit" className="w-100 mt-4" type="primary" size={'large'}>
                {isLoading ? <Spin /> : 'Đăng nhập'}
            </Button>
            <Button
                outline
                onClick={() => handleOpenModal('forgetPassword')}
            >
                Quên mật khẩu
            </Button>

            <div className="d-flex align-items-center gap-3 mt-5 mb-1">
                <div
                    className="w-100 d-flex align-items-center justify-content-center gap-2 p-2 rounded"
                    style={{ border: '1px solid #9999', cursor: 'pointer' }}
                >
                    <img
                        width={25}
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzODxDmyXiDdzXilTH_Ha2d83AoyVB8S3FHzq9rSiGww&s"
                        alt=""
                    />
                    <span style={{ fontWeight: 500 }}>Google</span>
                </div>
                <div
                    className="w-100 d-flex align-items-center justify-content-center gap-2 p-2 rounded"
                    style={{ border: '1px solid #9999', cursor: 'pointer' }}
                >
                    <img
                        width={25}
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1024px-Facebook_Logo_%282019%29.png"
                        alt=""
                    />
                    <span style={{ fontWeight: 500 }}>Facebook</span>
                </div>
            </div>
        </Form>
    );
};

export default Login;
