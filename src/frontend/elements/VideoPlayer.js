import YouTube from "react-youtube";

const VideoPlayer = ({videoId}) => {
    const options = {
        height: "540",
        width: "960",
        playerVars: {
            autoplay: 0,  // 1 = tự động phát
            controls: 1,  // 0 = ẩn nút điều khiển
            modestbranding: 1,
            rel: 0,        // Không đề xuất video khác sau khi phát xong
        },
    };
    
    return <YouTube videoId={videoId} opts={options} />;
}

export default VideoPlayer;