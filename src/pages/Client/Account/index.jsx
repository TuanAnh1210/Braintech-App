import { useState } from "react";

const Account = () => {
    const {avatar, fullName, phone, email} = JSON.parse(localStorage.getItem('access_token'))
    const [showModal, setShowModal] = useState(false);
    return(
        <>
            <div class="">
                <div class="container mx-auto py-8">
                    <div class="grid grid-cols-4 sm:grid-cols-12  gap-6 px-4">
                        <div class="col-span-4 sm:col-span-3">
                            <div class="bg-white shadow rounded-lg p-6">
                                <div class="flex flex-col items-center">
                                    <img src={avatar} class="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0">

                                    </img>
                                    <h1 class="text-2xl font-bold">{fullName}</h1>
                                    <div onClick={() => setShowModal(true)} class="mt-6 flex flex-wrap gap-4 justify-center">
                                        <a href="#" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Chỉnh sửa thông tin</a>
            
                                    </div>
                                </div>
                                <hr class="my-6 border-t border-gray-300"/>
                                <div class="flex flex-col">
                                <h1 class="text-2xl font-bold">Thông tin</h1>
                                    <div className="mb-2">
                                        <label className="text-sm italic">Họ và tên</label>
                                        <p className="text-lg font-[450]">{fullName}</p>
                                    </div>
                                    <div className="mb-2">
                                        <label className="text-sm italic">Số điện thoại</label>
                                        <p className="text-lg font-[450]">{phone}</p>
                                    </div>
                                    <div className="mb-2">
                                        <label className="text-sm italic">Email</label>
                                        <p className="text-lg font-[450]">{email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-span-4 sm:col-span-9">
                            <div class="bg-white shadow rounded-lg p-6">
                                <h2 class="text-xl font-bold mb-4">Các khóa học đã tham gia</h2>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showModal ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-[80%] my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start mx-auto justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Chỉnh sửa thông tin
                  </h3>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                <form action="#" class="mt-8 grid grid-cols-6 gap-6">
                    <div class="col-span-6 sm:col-span-3">
                        <label for="FirstName" class="block text-sm font-medium text-gray-700">
                        Họ và tên
                        </label>

                        <input
                        type="text"
                        id="FirstName"
                        name="first_name"
                        class="mt-1 w-full focus:outline-none h-[50px] rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                        />
                    </div>

                    <div class="col-span-6 sm:col-span-3">
                        <label for="LastName" class="block text-sm font-medium text-gray-700">
                        Số điện thoại
                        </label>

                        <input
                        type="text"
                        id="LastName"
                        name="last_name"
                        class="mt-1 w-full focus:outline-none h-[50px] rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                        />
                    </div>

                    <div class="col-span-6">
                        <label for="Email" class="block text-sm font-medium text-gray-700"> Email </label>

                        <input
                        type="email"
                        id="Email"
                        name="email"
                        class="mt-1 w-full focus:outline-none h-[50px] rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                        />
                    </div>
                    </form>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
        </>
    )
}
export default Account