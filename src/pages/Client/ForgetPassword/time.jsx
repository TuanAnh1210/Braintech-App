import React, { useState, useEffect } from 'react';

const OTPTimer = ({ expiryTime, keyProp }) => {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft());
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        setIsExpired(false)
        const intervalId = setInterval(() => {
            const time = getTimeLeft();
            setTimeLeft(time);

            if (time === 0) {
                setIsExpired(true);
                clearInterval(intervalId);
            }
        }, 1000);

        // Set timeout to display expired message after 30 seconds
        const timeoutId = setTimeout(() => {
            setIsExpired(true);
            clearInterval(intervalId);
        }, expiryTime - new Date().getTime());

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };

    }, [keyProp, expiryTime]);

    function getTimeLeft() {
        const currentTime = new Date().getTime();
        const remainingTime = expiryTime - currentTime;

        if (remainingTime <= 0) {
            return 0;
        }

        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        return seconds;
    }

    return (
        <div>
            {isExpired ? (
                <span className='text-red-500 mt-[15px]'>Mã OTP đã hết hạn, vui lòng lấy lại mã mới!</span>
            ) : (
                <span className='text-red-500 mt-[15px]'>Mã OTP sẽ hết hạn sau {timeLeft} giây!</span>
            )}
        </div>
    );
};

export default OTPTimer;
