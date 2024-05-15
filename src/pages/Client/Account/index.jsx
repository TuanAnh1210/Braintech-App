import Joi from 'joi';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import { notification } from 'antd';
import { useDropzone } from 'react-dropzone';
import { useUpdateProfileMutation } from '@/providers/apis/userApi';
import { useCookies } from 'react-cookie';
import { useGetAllSttCourseQuery } from '@/providers/apis/sttCourseApi';
import { jwtDecode } from 'jwt-decode';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useGetAllPaymentByUserQuery, useGetAllPaymentQuery } from '@/providers/apis/paymentDetail';
import { format } from 'date-fns';
import CourseBought from './CourseBought';
import CourseLearning from './CourseLearning';
import CourseFinished from './CourseFinished';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Account = () => {
    const navigate = useNavigate();
    const schema = Joi.object({
        full_name: Joi.string()
            .messages({
                'string.pattern.base': `Vui lòng nhập họ tên của bạn`,
                'string.empty': `Vui lòng không để trống`,
            })
            .required(),
        email: Joi.string()
            .email({ tlds: { allow: false } })
            .messages({
                'string.pattern.base': `Vui lòng đúng email của bạn`,
                'string.empty': `Vui lòng không để trống`,
            })
            .required(),
        phone: Joi.string()
            .regex(/^[0-9]{10}$/)
            .messages({
                'string.pattern.base': `Vui lòng nhập đúng số điện thoại`,
                'string.empty': `Vui lòng nhập số điện thoại`,
            })
            .required(),
    });
    const [cookies, setCookie] = useCookies(['cookieLoginStudent']);
    const [userid, setUserid] = useState(null);
    const [isChatTing, setIsChating] = useState(false);
    const [courseBought, setCourseBought] = useState(true);
    const [courseLearning, setCourseLearning] = useState(false);
    const [courseFinish, setCourseFinish] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: joiResolver(schema),
    });

    const data = cookies?.cookieLoginStudent;
    useEffect(() => {
        if (cookies.cookieLoginStudent) {
            const decode = jwtDecode(data?.accessToken);
            setUserid(decode._id);
        } else {
            navigate('/');
        }
    }, [cookies]);
    const { data: sttCourse, isLoading: loadingSttCourse } = useGetAllSttCourseQuery();
    const { data: coursePay, isLoading: coursePayLoading } = useGetAllPaymentByUserQuery();
    const dataBought = coursePay?.data?.filter((s) => s.user_id === userid && s.status === 'SUCCESS');
    const dataFinished = sttCourse?.data?.filter((s) => s.user_id === userid && s.isFinish === true);
    const dataJoined = sttCourse?.data?.filter((s) => s.user_id === userid && s.isFinish === false);
    const [uploadedImages, setUploadedImages] = useState();
    const [uploadFile, setUploadFile] = useState();
    const [handleUpdateProfile] = useUpdateProfileMutation();
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            setUploadedImages(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    }),
                ),
            );
            setUploadFile(acceptedFiles[0]);
        },
    });
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const updateLocalStorage = (accessToken, email, phone, fullName, avatar) => {
        const newData = {
            accessToken: accessToken,
            email: email,
            phone: phone,
            fullName: fullName,
            avatar: avatar,
        };
        setCookie('cookieLoginStudent', JSON.stringify(newData));
    };
    const onHandleUploadImg = async (file) => {
        // Upload ảnh lên ImgBB
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await fetch(import.meta.env.VITE_REACT_APP_API_PATH + 'upload/image', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            return data.url;
        } catch (error) {
            console.log(error);
            return avatar;
        }
    };
    const onSubmit = async (payload) => {
        try {
            let newUrl;
            const dataCookie = cookies?.cookieLoginStudent;

            uploadFile ? (newUrl = await onHandleUploadImg(uploadFile)) : (newUrl = dataCookie?.avatar);
            const { data, error } = await handleUpdateProfile({
                ...payload,
                accessToken: dataCookie.accessToken,
                avatar: newUrl,
            });
            if (error) {
                return notification.error({
                    message: 'Thông báo',
                    description: error.data.message,
                    duration: 1.75,
                });
            }
            updateLocalStorage(
                dataCookie.accessToken,
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
        } catch (error) {
            return notification.error({
                message: 'Thông báo',
                description: error.data?.message,
                duration: 1.75,
            });
        }
    };

    return (
        <>
            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-[80%] my-6 mx-auto max-w-3xl">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex items-start mx-auto justify-between mt-5 rounded-t">
                                    <h3 className="text-3xl font-semibold">Chỉnh sửa thông tin</h3>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <div>
                                        <div {...getRootProps()} className="flex">
                                            <input {...getInputProps()} />
                                            <img
                                                src={uploadedImages ? uploadedImages[0].preview : data?.avatar}
                                                className="w-[200px] h-[200px] bg-gray-300 rounded-full object-cover mx-auto mb-4 shrink-0"
                                            ></img>
                                        </div>
                                        <div>{}</div>
                                    </div>
                                    <form
                                        action="#"
                                        className="grid grid-cols-6 gap-6"
                                        onSubmit={handleSubmit(onSubmit)}
                                    >
                                        <div className="col-span-6 sm:col-span-3">
                                            <label
                                                htmlFor="FirstName"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Họ và tên
                                            </label>

                                            <input
                                                type="text"
                                                id="FirstName"
                                                name="full_name"
                                                {...register('full_name')}
                                                defaultValue={data?.fullName}
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
                                                {...register('phone')}
                                                defaultValue={data?.phone}
                                                className="mt-1 w-full last_name focus:outline-none h-[50px] rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm border-b border-solid border-blueGray-200 pl-4"
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
                                                defaultValue={data?.email}
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
            <div className="container mx-auto px-4">
                <div className=" h-[200px] w-[100vh] mx-auto relative bg-auto bg-no-repeat bg-[url('https://imgs.search.brave.com/mnNYq4S0KVo43YKN3R_KP3r6-JuZWTDL-2PIU_J31hs/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9oYXlj/YWZlLnZuL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIyLzAxL0hp/bmgtYW5oLWJpYS1k/ZXAtbmhhdC04MDB4/NDUwLmpwZw')]"></div>
                <div className="flex flex-col justify-center items-center m-3">
                    <img
                        className="absolute top-[150px] rounded-full  h-[150px]"
                        width={150}
                        src={data?.avatar ? data?.avatar : 'https://i.imgur.com/6b6b7Z6.png'}
                        alt="img"
                    />
                    <div className="text-center m-2">
                        <p className="font-bold">{data?.fullName}</p>
                        <p>{data?.email}</p>
                    </div>
                </div>
                <div className="flex justify-between border-t border-b w-full h-full">
                    <div className="flex justify-right gap-10 text-sm font-bold w-full">
                        <button
                            className={`hover:border-b-4 ${
                                courseBought && `border-b-4 border-[#f76b1c]`
                            }  justify-center border-b-4 flex items-center p-3 w-50 h-20 transition delay-200 ease-in-out`}
                            onClick={() => {
                                setCourseBought(true);
                                setCourseLearning(false);
                                setCourseFinish(false);
                            }}
                        >
                            Khóa học đã mua
                        </button>
                        <button
                            className={`hover:border-b-4 ${
                                courseLearning && `border-b-4 border-[#f76b1c]`
                            }  justify-center border-b-4 flex items-center p-3 w-50 h-20 transition delay-200 ease-in-out`}
                            onClick={() => {
                                setCourseBought(false);
                                setCourseLearning(true);
                                setCourseFinish(false);
                            }}
                        >
                            Khóa học đang học
                        </button>
                        <button
                            onClick={() => {
                                setCourseBought(false);
                                setCourseLearning(false);
                                setCourseFinish(true);
                            }}
                            className={`hover:border-b-4 ${
                                courseFinish && `border-b-4 border-[#f76b1c]`
                            }  justify-center border-b-4 flex items-center p-3 w-50 h-20 transition delay-200 ease-in-out`}
                        >
                            Khóa học đã hoàn thành
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setIsChating(true)}>
                            <FontAwesomeIcon icon="fa-regular fa-comment" /> Chat with teacher
                        </button>
                        <button onClick={() => setShowModal(true)}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="m-4 relative">
                    <div className="relative min-h-[100vh]">
                        <div className="flex justify-between">
                            <p className="text-lg font-semibold">Khóa học của tôi</p>
                            <div className="flex gap-2">
                                <p>Sort by :</p>
                                <select name="" id="">
                                    <option value="1">Asc</option>
                                    <option value="2">Desc</option>
                                </select>
                            </div>
                        </div>
                        {courseBought && <CourseBought dataBought={dataBought} isLoading={coursePayLoading} />}
                        {courseLearning && <CourseLearning dataJoined={dataJoined} isLoading={loadingSttCourse} />}
                        {courseFinish && <CourseFinished dataFinished={dataFinished} isLoading={loadingSttCourse} />}
                        {isChatTing ? (
                            <div className="fixed bottom-0 right-20 bg-red-300 w-[300px] h-[400px]">
                                <div className="flex justify-between p-3 bg-blue-600">
                                    <p className="text-sm flex items-center">Teacher Name - online</p>
                                    <button
                                        onClick={() => {
                                            setIsChating(false);
                                        }}
                                    >
                                        x
                                    </button>
                                </div>
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default Account;
