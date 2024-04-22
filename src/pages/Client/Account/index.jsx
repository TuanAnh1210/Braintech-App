import Joi from 'joi';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Account = () => {
    const schema = Joi.object({
        full_name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required(),
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: joiResolver(schema),
    });
    const courses = [
        {
            _id: '64c232eeca36426de30f6426',
            name: 'HTML CSS từ Zero đến Hero',
            thumb: 'https://res.cloudinary.com/dpjieqbsk/image/upload/v1681393126/braintech/spmz7sjkfyo8lkchmyqx.png',
            time: '23/04/2024',
        },
        {
            _id: '64c232eeca36426de30f6427',
            name: 'Kiến Thức Nhập Môn IT',
            thumb: 'https://res.cloudinary.com/dpjieqbsk/image/upload/v1681377227/braintech/cpge4lrnbot8fkkjgn7g.png',
            time: '20/01/2024',
        },
        {
            _id: '64c232eeca36426de30f6428',
            name: 'Node & ExpressJS',
            thumb: 'https://res.cloudinary.com/dpjieqbsk/image/upload/v1681377304/braintech/rl5psizy4vdmv9yk4nz8.png',
            time: '12/08/2023',
        },
    ];

    const access_token = JSON.parse(localStorage.getItem('access_token'));
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const updateLocalStorage = (access_token) => {
        const newData = {
            token: access_token?.token,
            email: access_token?.email,
            phone: access_token?.phone,
            fullName: access_token?.fullName,
            avatar: access_token?.avatar,
        };
        localStorage.setItem('access_token', JSON.stringify(newData));
    };
    const onSubmit = (data) => {
        try {
            fetch(`http://localhost:8080/api/user/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    updateLocalStorage(
                        token,
                        data.result.email,
                        data.result.phone,
                        data.result.full_name,
                        data.result.avatar,
                    );
                    setShowModal(false);
                    notification.success({
                        message: 'Thông báo',
                        description: data.message,
                        duration: 1.75,
                    });
                });
        } catch (error) {
            return notification.error({
                message: 'Thông báo',
                description: error.data?.message,
                duration: 1.75,
            });
        }
    };
    const user = useSelector((state) => state.user);

    useEffect(() => {
        if (user === null) {
            navigate('/');
        }
    }, [user]);
    return (
        <>
            <div class="">
                <div class="container mx-auto py-8">
                    <div class="grid grid-cols-4 sm:grid-cols-12  gap-6 px-4">
                        <div class="col-span-4 sm:col-span-3">
                            <div class="bg-white shadow rounded-lg p-6">
                                <div class="flex flex-col items-center">
                                    <img
                                        src={access_token?.avatar}
                                        class="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                                    ></img>
                                    <h1 class="text-2xl font-bold">{access_token?.fullName}</h1>
                                    <div
                                        onClick={() => setShowModal(true)}
                                        class="mt-6 flex flex-wrap gap-4 justify-center"
                                    >
                                        <a href="#" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                                            Chỉnh sửa thông tin
                                        </a>
                                    </div>
                                </div>
                                <hr class="my-6 border-t border-gray-300" />
                                <div class="flex flex-col">
                                    <h1 class="text-2xl font-bold">Thông tin</h1>
                                    <div className="mb-2">
                                        <label className="text-sm italic">Họ và tên</label>
                                        <p className="text-lg font-[450]">{access_token?.fullName}</p>
                                    </div>
                                    <div className="mb-2">
                                        <label className="text-sm italic">Số điện thoại</label>
                                        <p className="text-lg font-[450]">{access_token?.phone}</p>
                                    </div>
                                    <div className="mb-2">
                                        <label className="text-sm italic">Email</label>
                                        <p className="text-lg font-[450]  w-[50px]">{access_token?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-span-4 sm:col-span-9">
                            <div class="bg-white shadow rounded-lg p-6">
                                <h2 class="text-xl font-bold mb-4">Các khóa học đã tham gia</h2>
                                {courses.map((item, index) => {
                                    return (
                                        <>
                                            <div key={index} className="flex mt-4">
                                                <img className="w-[25%]" src={item.thumb} />
                                                <div className="ml-4">
                                                    <p className="font-bold mt-4">{item.name}</p>
                                                    <p className="mt-4 italic">Thời gian bắt đầu: {item.time}</p>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                            </div>
                            <div class="bg-white shadow rounded-lg p-6 mt-4">
                                <h2 class="text-xl font-bold mb-4">Các khóa học đã mua</h2>
                                {courses.map((item, index) => {
                                    return (
                                        <>
                                            <div key={index} className="flex mt-4">
                                                <img className="w-[25%]" src={item.thumb} />
                                                <div className="ml-4">
                                                    <p className="font-bold mt-4">{item.name}</p>
                                                    <p className="mt-4 italic">Thời gian bắt đầu: {item.time}</p>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                            </div>
                            <div class="bg-white shadow rounded-lg p-6 mt-4">
                                <h2 class="text-xl font-bold mb-4">Các khóa học đã hoàn thành</h2>
                                {courses.map((item, index) => {
                                    return (
                                        <>
                                            <div key={index} className="flex mt-4">
                                                <img className="w-[25%]" src={item.thumb} />
                                                <div className="ml-4">
                                                    <p className="font-bold mt-4">{item.name}</p>
                                                    <p className="mt-4 italic">Thời gian bắt đầu: {item.time}</p>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[80%] my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex items-start mx-auto justify-between p-5 rounded-t">
                                    <h3 className="text-3xl font-semibold">Chỉnh sửa thông tin</h3>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <form className="grid grid-cols-6 gap-6" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="col-span-6 sm:col-span-3">
                                            <label for="FirstName" className="block text-sm font-medium text-gray-700">
                                                Họ và tên
                                            </label>

                                            <input
                                                type="text"
                                                id="FirstName"
                                                name="full_name"
                                                {...register('full_name')}
                                                defaultValue={access_token?.fullName}
                                                className="mt-1 w-full focus:outline-none h-[50px] rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm border-b border-solid border-blueGray-200 pl-4"
                                            />
                                            {errors.full_name && (
                                                <span className="text-[#ff6969] italic">
                                                    {errors.full_name.message}
                                                </span>
                                            )}
                                        </div>

                                        <div className="col-span-6 sm:col-span-3">
                                            <label for="LastName" className="block text-sm font-medium text-gray-700">
                                                Số điện thoại
                                            </label>

                                            <input
                                                type="text"
                                                id="LastName"
                                                className="last_name"
                                                {...register('phone')}
                                                defaultValue={access_token?.phone}
                                                class="mt-1 w-full focus:outline-none h-[50px] rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm border-b border-solid border-blueGray-200 pl-4"
                                            />
                                            {errors.phone && (
                                                <span className="text-[#ff6969] italic">{errors.phone.message}</span>
                                            )}
                                        </div>

                                        <div className="col-span-6">
                                            <label for="Email" className="block text-sm font-medium text-gray-700">
                                                {' '}
                                                Email{' '}
                                            </label>

                                            <input
                                                type="email"
                                                id="Email"
                                                name="email"
                                                {...register('email')}
                                                defaultValue={access_token?.email}
                                                className="mt-1 w-full focus:outline-none h-[50px] rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm border-b border-solid border-blueGray-200 pl-4"
                                            />
                                            {errors.email && (
                                                <span className="text-[#ff6969] italic">{errors.email.message}</span>
                                            )}
                                        </div>
                                        <div className="flex rounded-b h-[60px] w-[700px] justify-end">
                                            <button
                                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                                type="submit"
                                            >
                                                Lưu thay đổi
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
};
export default Account;
