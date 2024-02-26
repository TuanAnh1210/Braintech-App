import { Breadcrumb, Image, Table, Button, Space } from 'antd';
import React from 'react';

const CourseList = () => {
    const [isloading, setLoading] = React.useState(false);
    const [data, setData] = React.useState([]);

    const fetchData = () => {
        setLoading(true);
        fetch('https://jsonplaceholder.typicode.com/todos').then((res) =>
            res.json().then((data) => {
                setData(data);
                setLoading(false);
            }),
        );
    };
    console.log(data);
    React.useEffect(() => {
        fetchData();
    }, []);
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
    };
    const columns = [
        {
            title: 'Tên khóa học',
            dataIndex: 'title',
            width: '20%',
            render: (title) => (
                <>
                    <h5>{title}</h5>
                </>
            ),
        },
        {
            title: 'Chủ đề',
            dataIndex: 'title',
            width: '20%',
            filters: [
                {
                    text: 'BackEnd',
                    value: 'Backend',
                },
                {
                    text: 'Frontend',
                    value: 'Frontend',
                },
                {
                    text: 'Devops',
                    value: 'Devops',
                },
            ],
            render: (title) => (
                <>
                    <p>Chủ đề {title}</p>
                </>
            ),
        },

        {
            title: 'Hình Ảnh',
            dataIndex: 'img',
            width: '20%',
            render: () => <Image src="https://picsum.photos/150/150" />,
        },
        {
            title: 'Chi tiết',
            dataIndex: 'desc',
            width: '20%',
            render: () => <Button className="bg-info text-white fw-bold">Kiểm tra</Button>,
        },
        {
            title: 'Thao tác',
            dataIndex: 'cell',
            width: '20%',
            render: () => (
                <Space>
                    <Button type="primary">Cập nhật </Button>
                    <Button danger>Khóa</Button>
                </Space>
            ),
        },
    ];
    return (
        <>
            <div className="w-100">
                <Breadcrumb className="mb-4" items={[{ title: 'Trang chủ' }, { title: 'Quản lý khóa học' }]} />

                <Table
                    className="bg-white p-3 rounded"
                    rowSelection={{ ...rowSelection }}
                    dataSource={data}
                    columns={columns}
                    rowKey={(record) => record.id}
                    loading={isloading}
                    title={() => {
                        return <p style={{ fontWeight: 600, fontSize: '20px' }}>Danh sách khóa học</p>;
                    }}
                />
            </div>
        </>
    );
};

export default CourseList;
