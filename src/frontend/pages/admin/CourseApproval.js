import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import styles from "./CourseApproval.module.css";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { FaList, FaCheck, FaSpinner } from "react-icons/fa";
import useGetAllDraftCourses from "../../hooks/draft_courses/useGetAllDraftCourses";

const CourseApproval = () => {
  useDocumentTitle("Admin - Kiểm duyệt khóa học");
  const location = useLocation();
  
  // Sử dụng hook để lấy dữ liệu từ API
  const { drafts, loading, error, refetch } = useGetAllDraftCourses();
  const [courses, setCourses] = useState([]);
  
  // Tự động refetch khi người dùng quay lại trang này
  useEffect(() => {
    // Fetch dữ liệu khi component được mount hoặc khi location thay đổi
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);
  
  // Áp dụng trạng thái từ localStorage vào danh sách khóa học
  useEffect(() => {
    if (!drafts) return;
    
    // Kiểm tra localStorage để xem có khóa học nào đã được xử lý trước đó không
    const processedCourses = JSON.parse(localStorage.getItem('processedCourses') || '{}');
    
    // Map các draft courses
    const mappedCourses = drafts.map(draft => {
      const courseId = draft.courseId;
      const status = processedCourses[courseId] || 'pending'; // pending, approved, rejected
      
      return {
        ...draft,
        courseId,
        status
      };
    });
    
    setCourses(mappedCourses);
  }, [drafts]);
  
  // Lọc các khóa học chưa bị từ chối
  const pendingCourses = courses.filter(course => course.status !== 'rejected');

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.container}>
          <div className={styles.loading}>
            <FaSpinner className={styles.spinner} />
            <p>Đang tải dữ liệu...</p>
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
            <button onClick={refetch} className={styles.retryButton}>Thử lại</button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Kiểm duyệt khóa học</h1>
          <div className={styles.subtitle}>
            <FaList /> <span>{pendingCourses.filter(c => c.status === 'pending').length} khóa học chờ duyệt</span>
          </div>
          <button onClick={refetch} className={styles.refreshButton}>
            <FaSpinner className={!loading ? styles.refreshIcon : styles.spinner} />
            Làm mới dữ liệu
          </button>
        </div>

        <div className={styles.courseGrid}>
          {pendingCourses.length === 0 ? (
            <div className={styles.noCourses}>
              <p>Không có khóa học nào đang chờ duyệt</p>
            </div>
          ) : (
            pendingCourses.map((course) => (
              <div key={course.courseId} className={`${styles.courseCard} ${course.status === 'approved' ? styles.approvedCourse : ''}`}>
                <div className={styles.courseImage}>
                  <img src={course.banner} alt={course.name} />
                  {course.status === 'approved' && (
                    <div className={styles.approvedBadge}>
                      <FaCheck /> Đã duyệt
                    </div>
                  )}
                </div>
                <div className={styles.courseInfo}>
                  <h3>{course.name}</h3>
                  <p>{course.author}</p>
                  <div className={styles.tags}>
                    {course.tags && course.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                  <div className={styles.price}>{course.price?.toLocaleString("vi-VN")}₫</div>
                  <Link 
                    to={`/admin/course-approval/${course.courseId}`} 
                    className={styles.reviewButton}
                  >
                    {course.status === 'approved' ? 'Xem chi tiết' : 'Xem xét'}
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CourseApproval;