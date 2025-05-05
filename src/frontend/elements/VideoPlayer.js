import { useRef } from "react";
import YouTube from "react-youtube";
import useVideoProgress from "../hooks/videos/useVideoProgress";

const VideoPlayer = ({videoId, onCompleted}) => {
    const playerRef = useRef(null);

    const {
        watchedTime,
        isCompleted,
        handlePlayerStateChange
    } = useVideoProgress(playerRef, videoId, onCompleted, 2);
    // hoàn thành sau 2% thời lượng video

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

    // const onPlayerReady = (event) => {
    //     playerRef.current = event.target;
    //     setPlayer(event.target);
    // };
    
    return (
        <div>
          <YouTube
            videoId={videoId}
            opts={options}
            onReady={(e) => (playerRef.current = e.target)}
            onStateChange={handlePlayerStateChange}
          />
          <p>Đã xem: {Math.round(watchedTime)} giây</p>
          <p>Trạng thái: {isCompleted ? "Hoàn thành ✅" : "Chưa hoàn thành ❌"}</p>
        </div>
      );
}

export default VideoPlayer;