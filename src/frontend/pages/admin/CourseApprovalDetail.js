import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./CourseApprovalDetail.module.css";
import AdminLayout from "./AdminLayout";
import { FaCheck, FaPlayCircle, FaTags, FaUserCheck, FaSpinner } from "react-icons/fa";
import TagsList from "../../elements/TagsList";
import ContentList from "../../elements/ContentList";
import CoursePreview from "../../elements/CoursePreview";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useGetDraftCourse from "../../hooks/draft_courses/useGetDraftCourse";
import useApproveDraftCourse from "../../hooks/draft_courses/useApproveDraftCourse";
import useRejectDraftCourse from "../../hooks/draft_courses/useRejectDraftCourse";

const CourseApprovalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);

  useDocumentTitle("Admin - Duyệt khóa học");

  // Sử dụng skipInitialFetch để kiểm soát việc fetch dữ liệu
  const [skipFetch, setSkipFetch] = useState(false);
  
  // Sử dụng hooks để tương tác với API
  const { draft, loading, error, fetchDraft } = useGetDraftCourse(id, skipFetch);
  const { approveCourse, loading: approving, error: approveError, success: approveSuccess } = useApproveDraftCourse();
  const { rejectCourse, loading: rejecting, error: rejectError, success: rejectSuccess } = useRejectDraftCourse();
  
  const [draftCourse, setDraftCourse] = useState(null);

  // Cập nhật draftCourse khi draft thay đổi
  useEffect(() => {
    if (!draft) return;
    
    // Kiểm tra localStorage để xem có khóa học nào đã được xử lý trước đó không
    const processedCourses = JSON.parse(localStorage.getItem('processedCourses') || '{}');
    
    // Kiểm tra xem khóa học đã được xử lý trước đó chưa
    const status = processedCourses[id] || 'pending';
    
    setDraftCourse({
      ...draft,
      status
    });
  }, [draft, id]);

  // Tạo hàm để load lại dữ liệu
  const refreshData = useCallback(() => {
    if (id) {
      setSkipFetch(false);
      fetchDraft();
    }
  }, [id, fetchDraft]);

  // Theo dõi kết quả của việc approve/reject
  useEffect(() => {
    if (approveSuccess || rejectSuccess) {
      // Delay navigation để người dùng thấy thông báo
      const timer = setTimeout(() => {
        navigate("/admin/course-approval", { replace: true });
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [approveSuccess, rejectSuccess, navigate]);

  const handleApproveCourse = async () => {
    try {
      await approveCourse(id);
      
      // Cập nhật trạng thái trong localStorage
      const processedCourses = JSON.parse(localStorage.getItem('processedCourses') || '{}');
      processedCourses[id] = 'approved';
      localStorage.setItem('processedCourses', JSON.stringify(processedCourses));
      
      // Thông báo thành công - navigation sẽ được xử lý trong useEffect
      alert("Khóa học đã được duyệt thành công");
    } catch (err) {
      console.error("Error approving course:", err);
    }
  };

  const handleRejectCourse = async () => {
    try {
      await rejectCourse(id);
      
      // Cập nhật trạng thái trong localStorage
      const processedCourses = JSON.parse(localStorage.getItem('processedCourses') || '{}');
      processedCourses[id] = 'rejected';
      localStorage.setItem('processedCourses', JSON.stringify(processedCourses));
      
      // Thông báo thành công - navigation sẽ được xử lý trong useEffect
      alert("Đã từ chối khóa học");
    } catch (err) {
      console.error("Error rejecting course:", err);
    }
  };

  const handleBackToList = useCallback(() => {
    navigate("/admin/course-approval");
  }, [navigate]);

  const handlePreviewCourse = () => {
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    setShowPreview(false);
  };

  // Xử lý khi component mount, đảm bảo fetch dữ liệu ngay từ đầu
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <div className={styles.loading}>
            <FaSpinner className={styles.spinner} />
            <p>Đang tải thông tin khóa học...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>Có lỗi xảy ra</h2>
            <p>{error}</p>
            <div className={styles.errorActions}>
              <button 
                className={styles.retryButton} 
                onClick={refreshData}
              >
                Thử lại
              </button>
              <button 
                className={styles.backButton} 
                onClick={handleBackToList}
              >
                &larr; Quay lại danh sách
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!draftCourse) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <h1>Không tìm thấy khóa học</h1>
          <button 
            className={styles.backButton} 
            onClick={handleBackToList}
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
            onClick={handleBackToList}
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
              
              {(approveError || rejectError) && (
                <div className={styles.apiError}>
                  {approveError || rejectError}
                </div>
              )}

              {(approveSuccess || rejectSuccess) && (
                <div className={styles.apiSuccess}>
                  {approveSuccess ? "Duyệt khóa học thành công!" : "Từ chối khóa học thành công!"}
                  <p>Đang chuyển hướng về danh sách khóa học...</p>
                </div>
              )}
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

      {showPreview && (
        <CoursePreview 
          course={draftCourse} 
          onBack={handleClosePreview} 
        />
      )}
    </AdminLayout>
  );
};

export default CourseApprovalDetail;