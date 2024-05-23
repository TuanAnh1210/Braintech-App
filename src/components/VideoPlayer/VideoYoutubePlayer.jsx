/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { memo, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

function VideoYoutubePlayer({ url = '', handleGetTime, setTimeVideo, timeChanges, handleSetFinish }) {
    const intervalRef = useRef(null);
    const playerRef = useRef(null);

    const opts = {
        // Cấu hình thẻ Youtube
        height: '515',
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    let videoId = url; // Mặc định là URL

    // Kiểm tra xem URL có dạng 'embed', 'watch', hay 'youtu.be'
    if (url.includes('/embed/')) {
        const regex = /(?<=\/embed\/)([^?]+)/;
        const match = url.match(regex);
        if (match) videoId = match[0];
    } else if (url.includes('/watch?v=')) {
        // URL dạng 'watch?v='
        const regex = /(?<=\?v=)([^&]+)/;
        const match = url.match(regex);
        if (match) videoId = match[0];
    } else if (url.includes('youtu.be/')) {
        // URL dạng 'youtu.be'
        const regex = /(?<=youtu.be\/)([^?]+)/;
        const match = url.match(regex);
        if (match) videoId = match[0];
    }

    const handleOnStateChange = (event) => {
        const player = event.target;

        playerRef.current = player;

        if (intervalRef.current) {
            clearInterval(intervalRef.current); // Xóa bỏ interval hiện tại nếu có
        }

        intervalRef.current = setInterval(() => {
            const currentTime = player.getCurrentTime();
            setTimeVideo(Math.floor(currentTime));
        }, 1000);
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (playerRef.current) {
            playerRef.current.seekTo(timeChanges.video_time);
        }
    }, [timeChanges]);

    return (
        <YouTube
            opts={opts}
            style={{
                width: '100%',
                height: '515px',
                maxWidth: 'none',
                maxHeight: 'none',
            }}
            iframeClassName="rounded-lg"
            videoId={videoId}
            onReady={handleGetTime}
            onEnd={handleSetFinish}
            onStateChange={handleOnStateChange}
        />
    );
}

export default memo(VideoYoutubePlayer);
