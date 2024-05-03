/* eslint-disable react/prop-types */
import { memo } from 'react';
import YouTube from 'react-youtube';

function VideoYoutubePlayer({ url = '', handleGetTime, handleSetFinish }) {
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
        />
    );
}

export default memo(VideoYoutubePlayer);
