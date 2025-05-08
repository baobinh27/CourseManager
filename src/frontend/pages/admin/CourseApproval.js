import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import styles from "./CourseApproval.module.css";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { FaList, FaCheck } from "react-icons/fa";
import mockCourses from "../../../mock_data/courses";

const CourseApproval = () => {
  useDocumentTitle("Admin - Kiểm duyệt khóa học");
  
  // Sử dụng state để lưu trạng thái của các khóa học
  const [courses, setCourses] = useState([]);
  
  // Khởi tạo danh sách khóa học từ mock data
  useEffect(() => {
    // Kiểm tra localStorage để xem có khóa học nào đã được xử lý trước đó không
    const processedCourses = JSON.parse(localStorage.getItem('processedCourses') || '{}');
    
    // Áp dụng trạng thái từ localStorage vào danh sách khóa học
    const mappedCourses = mockCourses.map(course => {
      const courseId = course._id;
      const status = processedCourses[courseId] || 'pending'; // pending, approved, rejected
      
      return {
        ...course,
        courseId,
        status
      };
    });
    
    setCourses(mappedCourses);
  }, []);
  
  // Lọc các khóa học chưa bị từ chối
  const pendingCourses = courses.filter(course => course.status !== 'rejected');

  return (
    <AdminLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Kiểm duyệt khóa học</h1>
          <div className={styles.subtitle}>
            <FaList /> <span>{pendingCourses.filter(c => c.status === 'pending').length} khóa học chờ duyệt</span>
          </div>
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