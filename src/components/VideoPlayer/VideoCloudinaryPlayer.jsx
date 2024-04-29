/* eslint-disable react/prop-types */
import React from 'react';
import videojs from 'video.js';

import 'video.js/dist/video-js.css';

function VideoCloudinaryPlayer({ url = '' }) {
    const videoRef = React.useRef(null);
    const playerRef = React.useRef(null);

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        // You can handle player events here, for example:
        player.on('waiting', () => {
            videojs.log('player is waiting');
        });

        player.on('dispose', () => {
            videojs.log('player will dispose');
        });
    };

    const videoJsOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        html5: {
            hls: {
                // withCredentials: true,
                overrideNative: true,
            },
        },
        sources: [
            {
                src: url,
                type: 'application/x-mpegURL',
            },
        ],
    };

    React.useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef.current) {
            // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
            const videoElement = document.createElement('video-js');

            videoElement.classList.add('vjs-big-play-centered');
            videoRef.current.appendChild(videoElement);

            const player = (playerRef.current = videojs(videoElement, videoJsOptions, () => {
                videojs.log('player is ready');
                handlePlayerReady && handlePlayerReady(player);
            }));

            // You could update an existing player in the `else` block here
            // on prop change, for example:
        } else {
            const player = playerRef.current;

            player.autoplay(videoJsOptions.autoplay);
            player.src(videoJsOptions.sources);
        }
    }, [videoJsOptions, videoRef]);

    // Dispose the Video.js player when the functional component unmounts
    React.useEffect(() => {
        const player = playerRef.current;

        return () => {
            if (player && !player.isDisposed()) {
                player.dispose();
                playerRef.current = null;
            }
        };
    }, [playerRef]);

    return (
        <div className="flex items-center justify-center w-full h-full" data-vjs-player>
            <div className="video-js bg-white w-full h-full" ref={videoRef} />
        </div>
    );
}

export default VideoCloudinaryPlayer;
