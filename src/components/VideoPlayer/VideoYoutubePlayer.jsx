/* eslint-disable react/prop-types */
function VideoYoutubePlayer({ url = '' }) {
    return (
        <iframe
            width="100%"
            height="380"
            title="YouTube video player"
            frameBorder="0"
            src={url}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
        ></iframe>
    );
}

export default VideoYoutubePlayer;
