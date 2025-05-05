import { useEffect, useRef, useState } from "react";

const useVideoProgress = (playerRef, videoId, onCompleted, target = 80) => {
    const [watchedTime, setWatchedTime] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const intervalRef = useRef(null);

    // Reset khi videoId thay đổi (chọn video khác)
    useEffect(() => {
        setWatchedTime(0);
        setIsCompleted(false);
    }, [videoId])

    // Gọi khi trạng thái video thay đổi
    const handlePlayerStateChange = (event) => {
        const player = event.target;
        const state = event.data;

        if (state === window.YT.PlayerState.PLAYING) {
            // Bắt đầu đếm thời gian thực tế
            if (!intervalRef.current) {
                intervalRef.current = setInterval(() => {
                    const duration = player.getDuration();
                    setWatchedTime((prev) => {
                        const updated = prev + 1;
                        const percentage = (updated / duration) * 100;

                        if (!isCompleted && percentage >= target) {
                            setIsCompleted(true);
                            if (onCompleted) onCompleted(videoId);
                        }

                        return updated;
                    });
                }, 1000);
            }
        } else {
            // Khi pause hoặc stop -> ngừng đếm
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            // Clean up khi component unmount
            clearInterval(intervalRef.current);
        };
    }, []);

    return {
        watchedTime,
        isCompleted,
        handlePlayerStateChange
    };
};

export default useVideoProgress;
