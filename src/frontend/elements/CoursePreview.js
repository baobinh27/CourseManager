import { useState, useEffect } from "react";
import styles from "./CoursePreview.module.css";
import { FaArrowLeft, FaChevronDown, FaChevronUp, FaPlayCircle, FaExclamationTriangle } from "react-icons/fa";
import YouTube from "react-youtube";

/**
 * Component xem trước nội dung khóa học cho admin preview
 * @param {Object} course - Thông tin khóa học
 * @param {Function} onBack - Hàm xử lý khi click nút quay lại
 */
const CoursePreview = ({ course, onBack }) => {
    const [selectedVideoId, setSelectedVideoId] = useState("");
    const [expandedSections, setExpandedSections] = useState([]);
    const [error, setError] = useState(null);
    const [processedContent, setProcessedContent] = useState([]);
    const [loading, setLoading] = useState(false);

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

    // Hàm lấy thông tin video từ YouTube API
    const fetchVideoInfo = async (videoId) => {
        try {
            // Sử dụng API công khai của YouTube để lấy thông tin video
            const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
            if (!response.ok) {
                throw new Error('Không thể lấy thông tin video');
            }
            const data = await response.json();
            return {
                title: data.title || `Video ${videoId}`,
                author: data.author_name || 'YouTube',
                thumbnailUrl: data.thumbnail_url
            };
        } catch (error) {
            console.error('Error fetching video info:', error);
            return null;
        }
    };

    // Xử lý dữ liệu content, hỗ trợ cả hai định dạng
    const processContent = async (courseData) => {
        if (!courseData || !courseData.content || !Array.isArray(courseData.content)) {
            return [];
        }

        const processedSections = [];

        for (const section of courseData.content) {
            const processedSection = { 
                sectionTitle: section.sectionTitle || "Chương không có tiêu đề", 
                sectionContent: []
            };

            if (!section.sectionContent || !Array.isArray(section.sectionContent)) {
                processedSections.push(processedSection);
                continue;
            }

            // Kiểm tra loại dữ liệu của sectionContent
            if (section.sectionContent.length > 0) {
                if (typeof section.sectionContent[0] === 'string') {
                    // DraftCourse: mảng các URL YouTube
                    const contentPromises = section.sectionContent.map(async (videoUrl, index) => {
                        const videoId = extractVideoId(videoUrl);
                        if (!videoId) {
                            return {
                                videoId: null,
                                title: `Video ${index + 1} (ID không hợp lệ)`,
                                url: videoUrl,
                                isDraft: true
                            };
                        }

                        // Lấy thông tin video từ YouTube
                        const videoInfo = await fetchVideoInfo(videoId);
                        return {
                            videoId: videoId,
                            title: videoInfo?.title || `Video ${index + 1}`,
                            author: videoInfo?.author || 'YouTube',
                            thumbnailUrl: videoInfo?.thumbnailUrl,
                            url: videoUrl,
                            isDraft: true
                        };
                    });

                    processedSection.sectionContent = await Promise.all(contentPromises);
                } else {
                    // Course thông thường: mảng các object với videoId, title, duration
                    processedSection.sectionContent = section.sectionContent.map(video => ({
                        ...video,
                        isDraft: false
                    }));
                }
            }

            processedSections.push(processedSection);
        }

        return processedSections;
    };

    // Khởi tạo trạng thái ban đầu khi course thay đổi
    useEffect(() => {
        const initializeCourse = async () => {
            try {
                if (!course) return;
                
                setLoading(true);
                setError(null);

                // Xử lý nội dung khóa học
                const processed = await processContent(course);
                setProcessedContent(processed);

                // Xử lý expandedSections
                setExpandedSections(processed.map((_, index) => index === 0));

                // Tìm video đầu tiên có sẵn để hiển thị
                if (processed.length > 0) {
                    let firstVideoId = null;
                    
                    // Tìm section đầu tiên có content
                    for (const section of processed) {
                        if (section.sectionContent && section.sectionContent.length > 0) {
                            for (const video of section.sectionContent) {
                                if (video.videoId) {
                                    firstVideoId = video.videoId;
                                    break;
                                }
                            }
                            if (firstVideoId) break;
                        }
                    }
                    
                    if (firstVideoId) {
                        setSelectedVideoId(firstVideoId);
                    } else {
                        setError("Không tìm thấy video nào trong khóa học này");
                    }
                } else {
                    setError("Khóa học không có nội dung");
                }
            } catch (err) {
                console.error("Error initializing CoursePreview:", err);
                setError("Có lỗi khi xử lý dữ liệu khóa học");
            } finally {
                setLoading(false);
            }
        };

        initializeCourse();
    }, [course]);

    // Toggle section expand/collapse
    const toggleSection = (sectionIndex) => {
        setExpandedSections(prev => {
            if (!prev || !Array.isArray(prev)) return [];
            
            const newState = [...prev];
            newState[sectionIndex] = !newState[sectionIndex];
            return newState;
        });
    };

    // Get selected video title
    const getVideoTitle = () => {
        if (!processedContent) return "Video Preview";
        
        try {
            for (const section of processedContent) {
                if (!section.sectionContent) continue;
                
                for (const video of section.sectionContent) {
                    if (video.videoId === selectedVideoId) {
                        return video.title || video.videoId || "Video không có tiêu đề";
                    }
                }
            }
            return "Video Preview";
        } catch (err) {
            console.error("Error getting video title:", err);
            return "Video Preview";
        }
    };

    // Youtube player options
    const youtubeOptions = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            fs: 1, // Cho phép chế độ toàn màn hình
        },
    };

    if (!course) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingMessage}>Đang tải nội dung khóa học...</div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <button onClick={onBack} className={styles.backButton}>
                        <FaArrowLeft /> Quay lại
                    </button>
                    <h2 className={styles.previewTitle}>[PREVIEW] {course.name || "Không có tiêu đề"}</h2>
                </div>
                <div className={styles.loadingMessage}>Đang lấy thông tin video từ YouTube...</div>
            </div>
        );
    }

    const hasContent = processedContent && processedContent.length > 0;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={onBack} className={styles.backButton}>
                    <FaArrowLeft /> Quay lại
                </button>
                <h2 className={styles.previewTitle}>[PREVIEW] {course.name || "Không có tiêu đề"}</h2>
            </div>
            
            {error && (
                <div className={styles.errorMessage}>
                    <FaExclamationTriangle /> {error}
                </div>
            )}
            
            <div className={styles.previewContent}>
                <div className={styles.sidebar}>
                    <h3 className={styles.sidebarTitle}>Nội dung khóa học</h3>
                    
                    {!hasContent && (
                        <div className={styles.emptyContent}>
                            Khóa học này chưa có nội dung
                        </div>
                    )}
                    
                    {hasContent && processedContent.map((section, sectionIndex) => (
                        <div key={sectionIndex} className={styles.section}>
                            <button 
                                className={styles.sectionHeader}
                                onClick={() => toggleSection(sectionIndex)}
                            >
                                <div className={styles.sectionTitle}>
                                    <span>{sectionIndex + 1}. {section.sectionTitle}</span>
                                </div>
                                {expandedSections && expandedSections[sectionIndex] ? (
                                    <FaChevronUp className={styles.icon} />
                                ) : (
                                    <FaChevronDown className={styles.icon} />
                                )}
                            </button>

                            {expandedSections && expandedSections[sectionIndex] && (
                                <ul className={styles.videoList}>
                                    {section.sectionContent && Array.isArray(section.sectionContent) ? 
                                        section.sectionContent.map((video, videoIndex) => (
                                            <li 
                                                key={video.videoId || `video-${sectionIndex}-${videoIndex}`} 
                                                className={`${styles.videoItem} ${selectedVideoId === video.videoId ? styles.active : ''} ${!video.videoId ? styles.invalidVideo : ''}`}
                                                onClick={() => video.videoId && setSelectedVideoId(video.videoId)}
                                                title={video.title || "Video không có tiêu đề"}
                                            >
                                                <div className={styles.videoInfo}>
                                                    <FaPlayCircle className={styles.playIcon} />
                                                    <div className={styles.videoTitle}>
                                                        <span className={styles.videoIndex}>{videoIndex + 1}.</span> {video.title || "Video không có tiêu đề"}
                                                        {!video.videoId && <span className={styles.invalidTag}> (Không hợp lệ)</span>}
                                                    </div>
                                                </div>
                                                {video.isDraft && video.url && !video.videoId && (
                                                    <div className={styles.invalidVideoTooltip}>
                                                        !
                                                    </div>
                                                )}
                                            </li>
                                        ))
                                        : (
                                            <li className={styles.emptyVideoList}>
                                                Chương này chưa có nội dung
                                            </li>
                                        )
                                    }
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
                
                <div className={styles.content}>
                    <div className={styles.videoContainer}>
                        <h3 className={styles.videoTitle}>{getVideoTitle()}</h3>
                        <div className={styles.videoBanner}>
                            {selectedVideoId ? (
                                <div className={styles.youtubeWrapper}>
                                    <YouTube 
                                        videoId={selectedVideoId}
                                        opts={youtubeOptions}
                                        className={styles.youtubePlayer}
                                        onError={(e) => {
                                            console.error("YouTube player error:", e);
                                            setError("Không thể tải video. Mã lỗi: " + e.data);
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className={styles.noVideoMessage}>
                                    <FaPlayCircle className={styles.noVideoIcon} />
                                    <p>Chọn một video để xem trước</p>
                                </div>
                            )}
                        </div>
                        <div className={styles.previewBadge}>
                            Đây là chế độ xem trước - Chỉ dành cho quản trị viên
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePreview; 