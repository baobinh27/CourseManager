import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import styles from "./CourseApprovalDetail.module.css";
import { FaCheck, FaPlayCircle, FaTags, FaUserCheck } from "react-icons/fa";
import TagsList from "../../elements/TagsList";
import ContentList from "../../elements/ContentList";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import mockCourses from "../../../mock_data/courses";

const CourseApprovalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [draftCourse, setDraftCourse] = useState(null);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  useDocumentTitle("Admin - Duyệt khóa học");

  // Lấy khóa học từ mock data và kiểm tra trạng thái từ localStorage
  useEffect(() => {
    const processedCourses = JSON.parse(localStorage.getItem('processedCourses') || '{}');
    const course = mockCourses.find(course => course._id === id);
    
    if (course) {
      // Kiểm tra xem khóa học đã được xử lý trước đó chưa
      const status = processedCourses[id] || 'pending';
      
      setDraftCourse({
        ...course,
        courseId: course._id,
        status
      });
    }
  }, [id]);

  const handleApproveCourse = () => {
    setApproving(true);
    
    // Cập nhật trạng thái trong localStorage
    const processedCourses = JSON.parse(localStorage.getItem('processedCourses') || '{}');
    processedCourses[id] = 'approved';
    localStorage.setItem('processedCourses', JSON.stringify(processedCourses));
    
    // Giả lập gọi API để duyệt khóa học
    setTimeout(() => {
      alert("Khóa học đã được duyệt thành công");
      navigate("/admin/course-approval");
    }, 1000);
  };

  const handleRejectCourse = () => {
    setRejecting(true);
    
    // Cập nhật trạng thái trong localStorage
    const processedCourses = JSON.parse(localStorage.getItem('processedCourses') || '{}');
    processedCourses[id] = 'rejected';
    localStorage.setItem('processedCourses', JSON.stringify(processedCourses));
    
    // Giả lập gọi API để từ chối khóa học
    setTimeout(() => {
      alert("Đã từ chối khóa học");
      navigate("/admin/course-approval");
    }, 1000);
  };

  const handlePreviewCourse = () => {
    // Chuyển hướng đến trang học với tham số adminPreview=true
    navigate(`/learning?courseId=${id}&adminPreview=true`);
  };

  if (!draftCourse) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <h1>Không tìm thấy khóa học</h1>
          <button 
            className={styles.backButton} 
            onClick={() => navigate("/admin/course-approval")}
          >
            &larr; Quay lại danh sách
          </button>
        </div>
      </AdminLayout>
    );
  }

  // Nếu khóa học đã được duyệt hoặc từ chối trước đó, hiển thị trạng thái
  const isProcessed = draftCourse.status === 'approved' || draftCourse.status === 'rejected';

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <button 
            className={styles.backButton} 
            onClick={() => navigate("/admin/course-approval")}
          >
            &larr; Quay lại danh sách
          </button>
          <h1>Kiểm duyệt khóa học</h1>
          {draftCourse.status === 'approved' && (
            <div className={styles.statusBadge + ' ' + styles.approvedBadge}>
              Khóa học đã được duyệt
            </div>
          )}
          {draftCourse.status === 'rejected' && (
            <div className={styles.statusBadge + ' ' + styles.rejectedBadge}>
              Khóa học đã bị từ chối
            </div>
          )}
        </div>

        <div className={styles.courseReview}>
          <div className={styles.courseInfo}>
            <div className={styles.overviewBox}>
              <h2>{draftCourse.name}</h2>
              
              <div className={styles.infoRow}>
                <FaCheck />
                <p>{draftCourse.description}</p>
              </div>

              <div className={styles.infoRow}>
                <FaUserCheck />
                <p>Tạo bởi {draftCourse.author}</p>
              </div>

              {draftCourse.tags && draftCourse.tags.length > 0 && (
                <div className={styles.infoRow}>
                  <FaTags />
                  <TagsList tags={draftCourse.tags} shorten={false} />
                </div>
              )}
            </div>

            <div className={styles.contentBox}>
              <h3>Nội dung khóa học</h3>
              <ContentList content={draftCourse.content} />
            </div>
          </div>

          <div className={styles.courseSidebar}>
            <div className={styles.previewCard}>
              <img src={draftCourse.banner} alt={draftCourse.name} className={styles.courseBanner} />
              <div className={styles.priceBox}>
                <h3 className={styles.price}>{draftCourse.price?.toLocaleString("vi-VN")}₫</h3>
              </div>
              <div className={styles.actions}>
                <button 
                  className={styles.previewButton}
                  onClick={handlePreviewCourse}
                >
                  <FaPlayCircle /> Xem trước nội dung
                </button>
                {!isProcessed && (
                  <>
                    <button 
                      className={styles.approveButton}
                      onClick={handleApproveCourse}
                      disabled={approving || rejecting}
                    >
                      {approving ? "Đang xử lý..." : "Duyệt khóa học"}
                    </button>
                    <button 
                      className={styles.rejectButton}
                      onClick={handleRejectCourse}
                      disabled={approving || rejecting}
                    >
                      {rejecting ? "Đang xử lý..." : "Từ chối"}
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className={styles.reviewNotes}>
              <h4>Lưu ý khi duyệt khóa học:</h4>
              <ul>
                <li>Nội dung phải phù hợp với chính sách của nền tảng</li>
                <li>Khóa học phải có nội dung chất lượng</li>
                <li>Các video phải rõ ràng và có chất lượng tốt</li>
                <li>Thông tin khóa học phải đầy đủ và chính xác</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CourseApprovalDetail;