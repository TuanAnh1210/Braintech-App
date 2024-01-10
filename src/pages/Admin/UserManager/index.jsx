/* eslint-disable react-hooks/exhaustive-deps */
import { Breadcrumb, Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import { useEffect, useRef, useState } from 'react';
import qs from 'qs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
});

function UserManager() {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    const searchInput = useRef(null);

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    spellCheck={false}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={''} // <SearchOutlined />
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button type="link" size="small" onClick={() => close()}>
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <FontAwesomeIcon
                icon={faSearch}
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) setTimeout(() => searchInput.current?.select(), 100);
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const fetchData = () => {
        setLoading(true);
        fetch(`https://randomuser.me/api?${qs.stringify(getRandomuserParams(tableParams))}`)
            .then((res) => res.json())
            .then(({ results }) => {
                setData(results);
                setLoading(false);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: 200,
                        // 200 is mock data, you should read it from server
                        // total: data.totalCount,
                    },
                });
            });
    };

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(tableParams)]);

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setData([]);
        }
    };

    const columns = [
        {
            title: 'Họ và tên',
            dataIndex: 'name',
            width: '20%',
            ...getColumnSearchProps('name'),
            render: (name) => `${name.first} ${name.last}`,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'picture',
            render: (picture) => {
                return (
                    <img
                        width={40}
                        style={{ minWidth: '40px', minHeight: '40px' }}
                        className="rounded-circle"
                        src={picture.medium}
                        alt=""
                    />
                );
            },
        },
        {
            title: 'Giới tính',
            dataIndex: 'gender',
            filters: [
                {
                    text: 'Male',
                    value: 'male',
                },
                {
                    text: 'Female',
                    value: 'female',
                },
            ],
            width: '20%',
        },
        {
            title: 'Địa chỉ email',
            dataIndex: 'email',
        },
        {
            title: 'Điện thoại',
            dataIndex: 'cell',
        },
    ];

    return (
        <div className="w-100">
            <Breadcrumb
                className="mb-4"
                items={[
                    {
                        title: 'Trang chủ',
                    },
                    {
                        title: 'Tài khoản',
                    },
                    {
                        title: 'Quản lý tài khoản',
                    },
                ]}
            />

            <Table
                className="bg-white p-3 rounded"
                columns={columns}
                rowKey={(record) => record.login.uuid}
                dataSource={data}
                pagination={tableParams.pagination}
                loading={loading}
                title={() => {
                    return <p style={{ fontWeight: 600, fontSize: '20px' }}>Danh sách tài khoản</p>;
                }}
                onChange={handleTableChange}
            />
        </div>
    );
}

export default UserManager;
