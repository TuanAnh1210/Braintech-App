import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const ENDPOINT = 'http://localhost:2096';
const socket = io(ENDPOINT, {
    secure: false, // sử dụng SSL/TLS
    port: 2096,
});
const Chat = () => {
    // const [message, setMessage] = useState('');
    // const [messages, setMessages] = useState([]);

    // // useEffect(() => {
    // //     socket.on('receiveMessage', (message) => {
    // //         console.log(message.id); // x8WIv7-mJelg7on_ALbx

    // //         setMessages((prevMessages) => [...prevMessages, message]);
    // //     });

    // //     // return () => {
    // //     //     socket.disconnect();
    // //     // };
    // // }, []);

    // const sendMessage = () => {
    //     if (message) {
    //         socket.emit('sendMessage', message);
    //         setMessage('');
    //     }
    // };

    const [userId, setUserId] = useState('');
    const [message, setMessage] = useState('');
    const [targetUserId, setTargetUserId] = useState('');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        socket.on('receiveNotification', (notification) => {
            setNotifications((prevNotifications) => [...prevNotifications, notification]);
        });

        // return () => {
        //     socket.off('receiveNotification');
        // };
    }, []);

    const registerUser = () => {
        socket.emit('register', userId);
    };

    const sendNotification = () => {
        console.log(targetUserId, 'targetUserId');
        socket.emit('sendNotification', { userId: targetUserId, message });
        setMessage('');
    };
    return (
        <div className="App">
            <h1>Real-time Notifications</h1>
            <div>
                <h2>Register User</h2>
                <input type="text" placeholder="Your ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
                <button onClick={registerUser}>Register</button>
            </div>
            <div>
                <h2>Send Notification</h2>
                <input
                    type="text"
                    placeholder="Target User ID"
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                />
                <input type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
                <button onClick={sendNotification}>Send Notification</button>
            </div>
            <div>
                <h2>Notifications</h2>
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={index}>{notification}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Chat;
