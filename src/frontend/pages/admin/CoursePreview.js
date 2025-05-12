import React, { useState, useEffect } from "react";
import styles from "./CoursePreview.module.css";
import { FaChevronLeft, FaPlayCircle, FaRegPlayCircle } from "react-icons/fa";
import VideoPlayer from "../../elements/VideoPlayer";
import helper from "../../utils/helper";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import mockCourses from "../../../mock_data/courses";

const CoursePreview = ({ courseId, onBack }) => {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useDocumentTitle(course ? `Preview: ${course.name}` : "Xem trước khóa học");

  // Sử dụng mock data thay vì fetch từ database
  useEffect(() => {
    if (!courseId) return;

    try {
      setLoading(true);
      // Tìm khóa học theo courseId trong mock data
      const foundCourse = mockCourses.find(c => c._id === courseId);
      
      if (foundCourse) {
        setCourse(foundCourse);
        
        // Chọn video đầu tiên nếu có
        if (foundCourse.content && 
            foundCourse.content.length > 0 && 
            foundCourse.content[0].sectionContent && 
            foundCourse.content[0].sectionContent.length > 0) {
          const firstVideo = foundCourse.content[0].sectionContent[0];
          setCurrentVideo(firstVideo.videoId);
        }
      } else {
        setError("Không tìm thấy khóa học");
      }
    } catch (err) {
      console.error("Error loading course:", err);
      setError("Đã xảy ra lỗi khi tải khóa học");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  const handleSelectVideo = (videoId) => {
    setCurrentVideo(videoId);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className={styles.errorContainer}>
        <h2>Lỗi</h2>
        <p>{error || "Không tìm thấy khóa học"}</p>
        <button onClick={onBack} className={styles.backButton}>
          <FaChevronLeft /> Quay lại
        </button>
      </div>
    );
  }

  const getCurrentVideoTitle = () => {
    for (const section of course.content) {
      for (const video of section.sectionContent) {
        if (video.videoId === currentVideo) {
          return video.title;
        }
      }
    }
    return "Chọn video để xem";
  };

  return (
    <div className={styles.container}>
      <PreviewHeader 
        courseName={course.name}
        onBackClick={onBack} 
      />
      <div className={styles.contentWrapper}>
        <div className={styles.contentList}>
          {course.content.map((section, sIndex) => (
            <div key={`section-${sIndex}`} className={styles.section}>
              <div className={styles.sectionTitle}>
                {`${sIndex + 1}. ${section.sectionTitle}`}
              </div>
              <div className={styles.videoList}>
                {section.sectionContent.map((video, vIndex) => (
                  <button
                    key={`video-${video.videoId}`}
                    className={`${styles.videoItem} ${currentVideo === video.videoId ? styles.activeVideo : ''}`}
                    onClick={() => handleSelectVideo(video.videoId)}
                  >
                    <div className={styles.videoIcon}>
                      {currentVideo === video.videoId ? 
                        <FaPlayCircle /> : 
                        <FaRegPlayCircle />}
                    </div>
                    <div className={styles.videoInfo}>
                      <div className={styles.videoTitle}>{video.title}</div>
                      <div className={styles.videoDuration}>
                        {helper.formatDuration(video.duration)}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.playerSection}>
          <div className={styles.adminBanner}>
            Bản xem trước - Dành cho quản trị viên
          </div>
          <div className={styles.videoContainer}>
            <VideoPlayer videoId={currentVideo} />
          </div>
          <h1 className={styles.videoTitle}>
            {getCurrentVideoTitle()}
          </h1>
        </div>
      </div>
    </div>
  );
};

const PreviewHeader = ({ courseName, onBackClick }) => {
  return (
    <div className={styles.header}>
      <button 
        onClick={onBackClick} 
        className={styles.backButton}
      >
        <div className={styles.backIcon}><FaChevronLeft /></div>
        <div className={styles.backText}>Quay lại trang duyệt khóa học</div>
      </button>
      
      <div className={styles.courseName}>
        [PREVIEW] {courseName}
      </div>
    </div>
  );
};

export default CoursePreview;