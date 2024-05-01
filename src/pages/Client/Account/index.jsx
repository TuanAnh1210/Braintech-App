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
import { useNavigate } from 'react-router-dom';
import { useGetAllPaymentQuery } from '@/providers/apis/paymentDetail';
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
    const { data: coursePay, isLoading: coursePayLoading } = useGetAllPaymentQuery();
    const dataBought = coursePay?.data?.filter((s) => s.user_id === userid && s.status !== 'CANCEL');
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
            const response = await fetch('http://127.0.0.1:8080/upload/image', {
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
            console.log(error);
            return notification.error({
                message: 'Thông báo',
                description: error.data?.message,
                duration: 1.75,
            });
        }
    };
    return (
        <>
            <div className="">
                <div className="container mx-auto py-8">
                    <div className="grid grid-cols-4 sm:grid-cols-12  gap-6 px-4">
                        <div className="col-span-4 sm:col-span-3">
                            <div className="bg-white shadow rounded-lg p-6">
                                <div className="flex flex-col items-center">
                                    <img
                                        src={data?.avatar}
                                        className="w-32 h-32 object-cover bg-gray-300 rounded-full mb-4 shrink-0"
                                    ></img>
                                    <h1 className="text-2xl font-bold">{data?.fullName}</h1>
                                    <div
                                        onClick={() => setShowModal(true)}
                                        className="mt-6 flex flex-wrap gap-4 justify-center"
                                    >
                                        <a
                                            href="#"
                                            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                        >
                                            Chỉnh sửa thông tin
                                        </a>
                                    </div>
                                </div>
                                <hr className="my-6 border-t border-gray-300" />
                                <div className="flex flex-col overflow-hidden">
                                    <h1 className="text-2xl font-bold">Thông tin</h1>
                                    <div className="mb-2">
                                        <label className="text-sm italic">Họ và tên</label>
                                        <p className="text-lg font-[450]">{data?.fullName}</p>
                                    </div>
                                    <div className="mb-2">
                                        <label className="text-sm italic">Số điện thoại</label>
                                        <p className="text-lg font-[450]">{data?.phone}</p>
                                    </div>
                                    <div className="mb-2">
                                        <label className="text-sm italic">Email</label>
                                        <p className="text-lg font-[450]  w-[50px]">{data?.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-4 sm:col-span-9">
                            <div className="bg-white shadow rounded-lg p-6">
                                <h2 className="text-xl font-bold mb-4">Các khóa học đã tham gia</h2>
                                {!loadingSttCourse && dataJoined?.length === 0
                                    ? 'Bạn chưa tham gia khóa học nào'
                                    : dataJoined?.map((item, index) => {
                                          return (
                                              <>
                                                  <div key={index} className="flex mt-4">
                                                      <img className="w-[25%]" src={item?.course_id?.thumb} />
                                                      <div className="ml-4">
                                                          <p className="font-bold mt-4">{item?.course_id?.name}</p>
                                                          <p className="mt-4 italic">Thời gian bắt đầu: {item.time}</p>
                                                      </div>
                                                  </div>
                                              </>
                                          );
                                      })}
                            </div>
                            <div className="bg-white shadow rounded-lg p-6 mt-4">
                                <h2 className="text-xl font-bold mb-4">Các khóa học đã mua</h2>
                                {!coursePayLoading && dataBought?.length === 0
                                    ? 'Bạn chưa mua khóa học nào'
                                    : dataBought?.map((item, index) => {
                                          return (
                                              <>
                                                  <div key={index} className="flex mt-4">
                                                      <img className="w-[25%]" src={item?.course_id?.thumb} />
                                                      <div className="ml-4">
                                                          <p className="font-bold mt-4">{item?.course_id?.name}</p>
                                                          <p className="mt-4 italic">
                                                              Thời gian bắt đầu: {item?.course_id?.time}
                                                          </p>
                                                      </div>
                                                  </div>
                                              </>
                                          );
                                      })}
                            </div>
                            <div className="bg-white shadow rounded-lg p-6 mt-4">
                                <h2 className="text-xl font-bold mb-4">Các khóa học đã hoàn thành</h2>
                                {!loadingSttCourse && dataFinished.length === 0
                                    ? 'Bạn chưa hoàn thành khóa học nào'
                                    : dataFinished?.map((item, index) => {
                                          return (
                                              <>
                                                  <div key={index} className="flex mt-4">
                                                      <img className="w-[25%]" src={item?.course_id.thumb} />
                                                      <div className="ml-4">
                                                          <p className="font-bold mt-4">{item?.course_id.name}</p>
                                                          <p className="mt-4 italic">Thời gian bắt đầu: </p>
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
        </>
    );
};
export default Account;
