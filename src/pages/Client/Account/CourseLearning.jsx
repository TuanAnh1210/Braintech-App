import React from 'react';
import { format } from 'date-fns';
import { useGetAllCateQuery } from '@/providers/apis/cateApi';
import { Link } from 'react-router-dom';

const CourseLearning = ({ dataJoined }) => {
    const { data: dataCate } = useGetAllCateQuery();
    const dataCheck = dataJoined.filter((e) => e);
    return (
        <div className="grid grid-cols-4 mt-4 justify-center gap-4">
            {dataCheck?.map((course) => {
                const cate_name = dataCate?.data.find((e) => {
                    return course?.course_id?.cate_id === e?._id;
                });
                return (
                    <Link to={`/detail/teacher/${course?.course_id?._id}`}>
                        <div className="flex flex-column p-4 border rounded drop-shadow-xl">
                            <img width={200} className="mx-auto rounded" src={course?.course_id?.thumb} alt="nodata" />
                            <div className="my-2">
                                <div>
                                    <p className="text-lg font-bold">{course?.course_id?.name}</p>
                                    <p className="text-xs leading-[10px] font-thin">
                                        Đã mua ngày: {format(course?.updatedAt, 'dd/MM/yyyy')}
                                    </p>
                                </div>
                                <div className="flex justify-between mt-1">
                                    <p className="bg-gray-200 mt-2 px-3 py-1 text-uppercase font-bold">
                                        {cate_name?.code}
                                    </p>
                                    <p></p>
                                </div>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};

export default CourseLearning;
