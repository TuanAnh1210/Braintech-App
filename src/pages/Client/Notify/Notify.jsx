import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Avatar, List, Radio, Space } from 'antd';
import { Container } from 'react-bootstrap';
import Title from 'antd/es/typography/Title';
import { divide } from 'lodash';

const positionOptions = ['top', 'bottom', 'both'];

const alignOptions = ['start', 'center', 'end'];
const Notify = () => {
    // const [position, setPosition] = useState < PaginationPosition > 'bottom';
    // const [align, setAlign] = useState < PaginationAlign > 'center';
    const [cookies, setCookie] = useCookies(['cookieLoginStudent']);
    const [noti, setNoti] = useState();

    console.log(noti, 'noti');
    const data = noti?.data?.map((item) => ({
        title: item?.content,
        info: item?.info,
        status: item?.status,
        notiId: item?._id,
    }));
    useEffect(() => {
        fetch(import.meta.env.VITE_REACT_APP_API_PATH + 'api/noti/' + cookies.cookieLoginStudent._id)
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                console.log(res, 'res');
                setNoti(res);
            });
    }, []);

    // const handleSeen = (data) => {
    //     const newItems = noti?.data?.map((item) => (item._id === data ? { ...item, status: true } : item));
    //     setNoti(newItems);
    // };

    return (
        <Container style={{ marginTop: '80px' }}>
            <Title>Danh sách thông báo của bạn</Title>

            <Space direction="vertical" style={{ marginBottom: '20px' }} size="middle"></Space>
            <List
                dataSource={data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src={`http://localhost:3000/src/assets/images/logo.png`} />}
                            title={
                                <a
                                // onClick={() => {
                                //     handleSeen(item.notiId);
                                // }}
                                >
                                    {item.title}
                                </a>
                            }
                            description={item.info}
                        />
                        <span>{item?.status ? 'Đã xem' : 'Chưa xem'}</span>
                    </List.Item>
                )}
            />
        </Container>
    );
};

export default Notify;
