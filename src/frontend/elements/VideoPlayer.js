import { useRef } from "react";
import YouTube from "react-youtube";
import useVideoProgress from "../hooks/videos/useVideoProgress";

const VideoPlayer = ({videoId, onCompleted, width = 960}) => {
    const playerRef = useRef(null);

    const {
        handlePlayerStateChange
    } = useVideoProgress(playerRef, videoId, onCompleted, 2);
    // hoàn thành sau 2% thời lượng video

    const options = {
        height: Math.round(width / 16 * 9),
        width: width,
        playerVars: {
            autoplay: 0,  // 1 = tự động phát
            controls: 1,  // 0 = ẩn nút điều khiển
            modestbranding: 1,
            rel: 0,        // Không đề xuất video khác sau khi phát xong
        },
    };
    // if (watchedTime % 5 === 0 ) console.log("Đã xem: ", Math.round(watchedTime));
    // if (isCompleted) console.log("Hoàn thành video!");
    
    return (
        <div>
          <YouTube
            videoId={videoId}
            opts={options}
            onReady={(e) => (playerRef.current = e.target)}
            onStateChange={handlePlayerStateChange}
          />
          {/* <p>Đã xem: {Math.round(watchedTime)} giây</p>
          <p>Trạng thái: {isCompleted ? "Hoàn thành ✅" : "Chưa hoàn thành ❌"}</p> */}
        </div>
      );
}

export default VideoPlayer;