import { useState } from "react";
import styles from "./CoursePreview.module.css";
import { FaArrowLeft, FaChevronDown, FaChevronUp, FaPlayCircle } from "react-icons/fa";
import YouTube from "react-youtube";

/**
 * Component xem trước nội dung khóa học cho admin preview
 * @param {Object} course - Thông tin khóa học
 * @param {Function} onBack - Hàm xử lý khi click nút quay lại
 */
const CoursePreview = ({ course, onBack }) => {
    const [selectedVideoId, setSelectedVideoId] = useState(
        course?.content && course.content.length > 0 && 
        course.content[0].sectionContent && 
        course.content[0].sectionContent.length > 0 ? 
        course.content[0].sectionContent[0].videoId : ""
    );
    
    const [expandedSections, setExpandedSections] = useState(
        course?.content?.map((_, index) => index === 0)
    );

    // Toggle section expand/collapse
    const toggleSection = (sectionIndex) => {
        setExpandedSections(prev => {
            const newState = [...prev];
            newState[sectionIndex] = !newState[sectionIndex];
            return newState;
        });
    };

    // Get selected video title
    const getVideoTitle = () => {
        for (const section of course?.content || []) {
            for (const video of section.sectionContent || []) {
                if (video.videoId === selectedVideoId) {
                    return video.title || video.videoId;
                }
            }
        }
        return "Video Preview";
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
        return <div className={styles.container}>
            <div className={styles.loadingMessage}>Loading course content...</div>
        </div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={onBack} className={styles.backButton}>
                    <FaArrowLeft /> Quay lại
                </button>
                <h2 className={styles.previewTitle}>[PREVIEW] {course.name}</h2>
            </div>
            
            <div className={styles.previewContent}>
                <div className={styles.sidebar}>
                    <h3 className={styles.sidebarTitle}>Nội dung khóa học</h3>
                    
                    {course.content && course.content.map((section, sectionIndex) => (
                        <div key={sectionIndex} className={styles.section}>
                            <button 
                                className={styles.sectionHeader}
                                onClick={() => toggleSection(sectionIndex)}
                            >
                                <div className={styles.sectionTitle}>
                                    <span>{sectionIndex + 1}. {section.sectionTitle}</span>
                                </div>
                                {expandedSections[sectionIndex] ? (
                                    <FaChevronUp className={styles.icon} />
                                ) : (
                                    <FaChevronDown className={styles.icon} />
                                )}
                            </button>

                            {expandedSections[sectionIndex] && (
                                <ul className={styles.videoList}>
                                    {section.sectionContent && section.sectionContent.map((video, videoIndex) => (
                                        <li 
                                            key={video.videoId} 
                                            className={`${styles.videoItem} ${selectedVideoId === video.videoId ? styles.active : ''}`}
                                            onClick={() => setSelectedVideoId(video.videoId)}
                                        >
                                            <div className={styles.videoInfo}>
                                                <FaPlayCircle className={styles.playIcon} />
                                                <span className={styles.videoTitle}>
                                                    {videoIndex + 1}. {video.title || video.videoId}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
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