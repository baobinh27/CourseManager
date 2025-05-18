import { useEffect, useState } from "react";
import styles from "./ContentList.module.css";
import { FaAngleDown, FaAngleUp, FaClock, FaPlayCircle, FaThList } from "react-icons/fa";
import helper from "../utils/helper";
import useIsMobile from "../hooks/useIsMobile";

// Cache để lưu trữ thông tin video đã được lấy từ API
const videoCache = {};

function getContentOverview(content) {
    if (!content || !Array.isArray(content) || content.length === 0) {
        return "Không có nội dung";
    }

    let totalSeconds = 0, totalMinutes = 0, totalHours = 0;
    let totalItems = 0;
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    
    content.forEach(section => {
        if (section.sectionContent && Array.isArray(section.sectionContent)) {
            section.sectionContent.forEach(item => {
                totalItems++;
                // Kiểm tra xem duration có tồn tại không
                if (item.duration) {
                    const match = item.duration.match(regex);
                    if (match) {
                        // Kết quả match[1], match[2], match[3] có thể là undefined
                        // Chuyển sang cách truy cập an toàn hơn
                        const hours = match[1] ? parseInt(match[1]) : 0;
                        const minutes = match[2] ? parseInt(match[2]) : 0;
                        const seconds = match[3] ? parseInt(match[3]) : 0;
                        
                        totalHours += hours;
                        totalMinutes += minutes;
                        totalSeconds += seconds;
                    }
                }
            });
        }
    });

    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds %= 60;
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    return `Bao gồm ${content.length} chương, ${totalItems} nội dung, tổng thời lượng ${totalHours > 0 ? totalHours + "h " : ""}${totalMinutes}m ${totalSeconds}s.`;
}

// Hàm trích xuất videoId từ URL YouTube
const extractVideoId = (url) => {
    if (!url) return null;
    
    // Hỗ trợ các định dạng URL YouTube phổ biến
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
        /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    return null;
};

// Hàm lấy thông tin video từ API
const fetchVideoInfo = async (videoId) => {
    // Kiểm tra cache trước
    if (videoCache[videoId]) {
        return videoCache[videoId];
    }
    
    try {
        // Sử dụng API oEmbed của YouTube để lấy thông tin video
        const oembedResponse = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        if (!oembedResponse.ok) {
            throw new Error('Không thể lấy thông tin video');
        }
        
        const oembedData = await oembedResponse.json();
        
        // Thử lấy thêm thông tin từ API chính thức của YouTube (nếu có chìa khóa API)
        // hoặc sử dụng API công khai khác để lấy thời lượng video
        let duration = null;
        try {
            // Sử dụng API không chính thức để lấy thời lượng
            const infoResponse = await fetch(`https://returnyoutubedislikeapi.com/video/details?videoId=${videoId}`);
            if (infoResponse.ok) {
                const infoData = await infoResponse.json();
                if (infoData.length) {
                    duration = infoData.length;
                }
            }
        } catch (error) {
            console.error('Error fetching duration:', error);
        }
        
        const videoInfo = {
            title: oembedData.title || `Video ${videoId}`,
            author: oembedData.author_name || 'YouTube',
            thumbnailUrl: oembedData.thumbnail_url,
            duration: duration // Thời lượng video theo giây
        };
        
        // Lưu vào cache
        videoCache[videoId] = videoInfo;
        
        return videoInfo;
    } catch (error) {
        console.error('Error fetching video info:', error);
        return null;
    }
};

// Hàm chuyển đổi thời lượng tính bằng giây sang định dạng HH:MM:SS
const formatDurationFromSeconds = (seconds) => {
    if (!seconds || isNaN(seconds)) return "00:00";
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
};

// Hàm trích xuất tiêu đề video từ URL
const extractVideoTitle = (url) => {
    if (!url) return null;
    
    // Trích xuất tiêu đề từ URL nếu có thể
    try {
        const decodedUrl = decodeURIComponent(url);
        // Tìm tiêu đề trong URL nếu có
        const titleMatch = decodedUrl.match(/title=([^&]+)/);
        if (titleMatch && titleMatch[1]) {
            return titleMatch[1].replace(/\+/g, ' ');
        }
        
        // Nếu URL chứa tiêu đề sau dấu | hoặc -
        const separatorMatch = decodedUrl.match(/[||-]\s*(.+?)(?:\s*[||]|$)/);
        if (separatorMatch && separatorMatch[1]) {
            return separatorMatch[1].trim();
        }
        
        // Lấy tên video từ phần cuối URL
        const pathParts = new URL(url).pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        if (lastPart && lastPart !== '') {
            return lastPart.replace(/-|_/g, ' ');
        }
    } catch (e) {
        console.error('Error extracting video title:', e);
    }
    
    // Lấy videoId nếu không thể trích xuất tiêu đề
    const videoId = extractVideoId(url);
    return videoId ? `Video ${videoId}` : null;
};

// Hàm tính tổng thời lượng của một section
const calculateSectionDuration = (section) => {
    if (!section || !section.sectionContent || !Array.isArray(section.sectionContent)) {
        return { hours: 0, minutes: 0, seconds: 0 };
    }
    
    let totalSeconds = 0, totalMinutes = 0, totalHours = 0;
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    
    section.sectionContent.forEach(item => {
        if (item.duration) {
            const match = item.duration.match(regex);
            if (match) {
                const hours = match[1] ? parseInt(match[1]) : 0;
                const minutes = match[2] ? parseInt(match[2]) : 0;
                const seconds = match[3] ? parseInt(match[3]) : 0;
                
                totalHours += hours;
                totalMinutes += minutes;
                totalSeconds += seconds;
            }
        }
    });
    
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds %= 60;
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;
    
    return { hours: totalHours, minutes: totalMinutes, seconds: totalSeconds };
};

// Hàm hiển thị thời lượng đẹp hơn
const formatDurationDisplay = (hours, minutes, seconds) => {
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0 || hours > 0) result += `${minutes}m `;
    result += `${seconds}s`;
    return result;
};

const ContentList = ({content}) => {
    const isMobile = useIsMobile('(max-width: 768px)');
    const [showSectionDetail, setShowSectionDetail] = useState([]);
    const [videoInfo, setVideoInfo] = useState({});
    const [isLoadingInfo, setIsLoadingInfo] = useState(false);

    useEffect(() => {
        if (!content) return;
        setShowSectionDetail(content.map(() => false));        
    }, [content]);

    // Tải thông tin video khi content thay đổi
    useEffect(() => {
        const loadVideoInfo = async () => {
            if (!content || !Array.isArray(content)) return;
            
            setIsLoadingInfo(true);
            const info = {...videoInfo};
            
            // Tìm tất cả video trong content
            for (const section of content) {
                if (!section.sectionContent || !Array.isArray(section.sectionContent)) continue;
                
                for (const item of section.sectionContent) {
                    let videoId = null;
                    
                    if (typeof item === 'string') {
                        // Trường hợp URL YouTube
                        videoId = extractVideoId(item);
                    } else if (item.videoId) {
                        // Trường hợp object với videoId
                        videoId = item.videoId;
                    }
                    
                    if (videoId && !info[videoId] && !videoCache[videoId]) {
                        // Lấy thông tin video từ API
                        try {
                            const videoData = await fetchVideoInfo(videoId);
                            if (videoData) {
                                info[videoId] = videoData;
                            }
                        } catch (err) {
                            console.error(`Error fetching info for video ${videoId}:`, err);
                        }
                    }
                }
            }
            
            setVideoInfo(info);
            setIsLoadingInfo(false);
        };
        
        loadVideoInfo();
    }, [content]);

    const toggleSection = (index) => {
        setShowSectionDetail((prevState) =>
            prevState.map((item, i) => (i === index ? !item : item))
        );
    };

    // Hàm lấy thời lượng video
    const getVideoDuration = (video) => {
        // Nếu video là object với duration đã định dạng
        if (video.duration) {
            return helper.formatDuration(video.duration);
        }
        
        // Tìm videoId
        let videoId = null;
        if (typeof video === 'string') {
            videoId = extractVideoId(video);
        } else if (video.videoId) {
            videoId = video.videoId;
        }
        
        // Lấy thời lượng từ cache hoặc API
        if (videoId) {
            const cachedInfo = videoCache[videoId] || videoInfo[videoId];
            if (cachedInfo && cachedInfo.duration) {
                return formatDurationFromSeconds(cachedInfo.duration);
            }
        }
        
        // Giá trị mặc định
        return "00:00";
    };

    if (!content || !Array.isArray(content) || content.length === 0) {
        return (
            <div className={`flex-col ${styles.gap}`}>
                <h3 className="h3">Nội dung khoá học</h3>
                <p>Chưa có nội dung cho khóa học này</p>
            </div>
        );
    }

    return (
        <div className={`flex-col ${styles.gap}`}>
            <h3 className="h3">Nội dung khoá học</h3>
            <div className={`flex-row ${styles["justify-center"]} ${styles.gap}`}>
                <FaThList />
                <h1 className="h5">{getContentOverview(content)}</h1>
            </div>
            {content.map((section, index) => {
                // Tính tổng thời lượng của section
                const sectionDuration = calculateSectionDuration(section);
                const formattedSectionDuration = formatDurationDisplay(
                    sectionDuration.hours, 
                    sectionDuration.minutes, 
                    sectionDuration.seconds
                );
                
                return (
                    <div key={index}>
                        <button
                            onClick={() => toggleSection(index)}
                            className={styles.section}
                        >
                            <div className="flex-row align-center" style={{width: "100%", justifyContent: "space-between"}}>
                                <p className="h4 truncate" style={{marginRight: "10px"}}>
                                    {`${index + 1}. ${section.sectionTitle || 'Chương không có tiêu đề'}`}
                                </p>
                                <div className={styles.sectionDuration}>
                                    <FaClock style={{marginRight: "5px"}} />
                                    <span>{formattedSectionDuration}</span>
                                    {showSectionDetail[index] ? <FaAngleUp style={{marginLeft: "10px"}} /> : <FaAngleDown style={{marginLeft: "10px"}} />}
                                </div>
                            </div>
                        </button>

                        {showSectionDetail[index] && 
                            <ul type="none">
                                {section.sectionContent && Array.isArray(section.sectionContent) ? 
                                    section.sectionContent.map((video, videoIndex) => {
                                        // Xác định tiêu đề video dựa trên loại dữ liệu
                                        let videoTitle = 'Video không có tiêu đề';
                                        let videoId = null;
                                        
                                        if (typeof video === 'string') {
                                            // Trường hợp URL YouTube trong draftCourse
                                            videoId = extractVideoId(video);
                                            if (videoId && ((videoInfo[videoId] && videoInfo[videoId].title) || (videoCache[videoId] && videoCache[videoId].title))) {
                                                // Ưu tiên dùng tiêu đề đã tải
                                                videoTitle = (videoInfo[videoId] && videoInfo[videoId].title) || 
                                                           (videoCache[videoId] && videoCache[videoId].title);
                                            } else {
                                                // Dùng tiêu đề trích xuất từ URL
                                                const extractedTitle = extractVideoTitle(video);
                                                videoTitle = extractedTitle || `Video ${videoIndex + 1}`;
                                            }
                                        } else if (video.videoId) {
                                            // Trường hợp object với videoId
                                            videoId = video.videoId;
                                            if (videoId && 
                                                ((videoInfo[videoId] && videoInfo[videoId].title) || 
                                                (videoCache[videoId] && videoCache[videoId].title)) && 
                                                !video.title) {
                                                // Dùng tiêu đề đã tải nếu object không có title
                                                videoTitle = (videoInfo[videoId] && videoInfo[videoId].title) || 
                                                           (videoCache[videoId] && videoCache[videoId].title);
                                            } else if (video.title) {
                                                // Ưu tiên dùng title trong object
                                                videoTitle = video.title;
                                            } else {
                                                videoTitle = `Video ${videoId}`;
                                            }
                                        } else {
                                            // Fallback
                                            videoTitle = `Video ${videoIndex + 1}`;
                                        }
                                        
                                        // Lấy thời lượng video
                                        const videoDuration = getVideoDuration(video);
                                        
                                        return (
                                            <li key={videoId || `video-${videoIndex}`} className={styles.item}>
                                                <div className={`flex-row align-center ${styles.gap} h5`} style={{width: `${isMobile ? "calc(100% - 8rem)" : "calc(100% - 10rem)"}`}}>
                                                    <FaPlayCircle style={{fill: "#ff7700", width: "1.5rem", minWidth: "1.5rem"}} />
                                                    <div className={styles.videoTitleContainer}>
                                                        <p className={`${isMobile ? "h6" : "h5"} truncate`}>{videoTitle}</p>
                                                        <p className={styles.videoSubtitle}>
                                                            {`${videoIndex + 1}. Video ${videoDuration}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`flex-row align-center ${styles.gap} ${isMobile ? "h6" : "h5"}`} style={{minWidth: isMobile ? "8rem" : "10rem"}}>
                                                    <div className={styles.durationBadge}>
                                                        <FaClock style={{marginRight: "5px"}}/>
                                                        <p>{videoDuration}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    }) : 
                                    <li className={styles.item}>
                                        <p>Chương này chưa có nội dung</p>
                                    </li>
                                }
                            </ul>
                        }
                    </div>
                );
            })}
        </div>
    );
};

export default ContentList;