import React, { useState, useEffect } from 'react';
import AdminLayout from "./AdminLayout"; // Import the layout component
import styles from './CourseManagement.module.css';
import { useNavigate } from 'react-router-dom';

// Mock data - Replace with actual API call
const mockCourses = [
  { _id: '1', name: 'Khóa học React cơ bản', author: 'Admin A', lastModified: '2024-01-15T10:00:00Z', enrolCount: 150 },
  { _id: '2', name: 'Node.js cho người mới bắt đầu', author: 'Giảng viên B', lastModified: '2024-02-20T14:30:00Z', enrolCount: 95 },
  { _id: '3', name: 'Thiết kế Web nâng cao', author: 'Admin A', lastModified: '2024-03-10T09:15:00Z', enrolCount: 210 },
  // For testing pagination, uncomment these or add more mock courses
  { _id: '4', name: 'JavaScript Advanced', author: 'Admin C', lastModified: '2024-03-15T10:20:00Z', enrolCount: 180 },
  { _id: '5', name: 'CSS Mastery', author: 'Giảng viên D', lastModified: '2024-03-18T11:30:00Z', enrolCount: 120 },
  { _id: '6', name: 'Python Basics', author: 'Admin B', lastModified: '2024-03-20T09:00:00Z', enrolCount: 250 },
];

function CourseManagement() {
  
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(5); // Show 5 courses per page
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      setLoading(false);
    }, 500); 

  }, []); 

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = courses.filter(course =>
      course.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      course.author.toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredCourses(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, courses]);

  // Calculate current courses to display
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewDetails = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleEdit = (courseId) => {
    navigate(`/admin/edit-course/${courseId}`); 
  };

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDelete = async (courseId, courseName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${courseName}" không? Hành động này không thể hoàn tác.`)) {
      try {
        console.log(`(API Call) Xóa khóa học: ${courseId}`);
        // Update state after successful deletion (simulation)
        const updatedCourses = courses.filter(course => course._id !== courseId);
        setCourses(updatedCourses);
        alert(`Đã xóa khóa học "${courseName}"`);
      } catch (err) {
        console.error(`Lỗi khi xóa khóa học ${courseId}:`, err);
        alert("Đã xảy ra lỗi khi xóa khóa học.");
      }
    }
  };

  return (
    <AdminLayout>
      <div className={styles.courseManagementContainer}>
        <div className={styles.headerSection}>
          <h1>Quản lý Khóa học</h1>
        </div>

        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên khóa học hoặc tác giả..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>

        {loading ? (
          <div className={styles.message}>Đang tải danh sách khóa học...</div>
        ) : error ? (
          <div className={`${styles.message} ${styles.error}`}>{error}</div>
        ) : filteredCourses.length > 0 ? (
          <>
            <table className={styles.courseTable}>
              <thead>
                <tr>
                  <th>Tên Khóa Học</th>
                  <th>Người Tạo</th>
                  <th>Ngày Cập Nhật</th>
                  <th>Số Lượng Đăng Ký</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentCourses.map((course) => (
                  <tr key={course._id}>
                    <td>{course.name}</td>
                    <td>{course.author}</td>
                    <td>{new Date(course.lastModified).toLocaleDateString()}</td>
                    <td className={styles.enrollCount}>{course.enrolCount}</td>
                    <td className={styles.actions}>
                      <button onClick={() => handleViewDetails(course._id)} className={styles.actionButton}>
                        Xem
                      </button>
                      <button onClick={() => handleEdit(course._id)} className={`${styles.actionButton} ${styles.editButton}`}>
                        Sửa
                      </button>
                      <button onClick={() => handleDelete(course._id, course.name)} className={`${styles.actionButton} ${styles.deleteButton}`}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination controls */}
            <div className={styles.paginationContainer}>
              <button 
                onClick={prevPage} 
                disabled={currentPage === 1} 
                className={styles.paginationButton}
              >
                Trước
              </button>
              
              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`${styles.pageNumber} ${currentPage === i + 1 ? styles.activePage : ''}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={nextPage} 
                disabled={currentPage === totalPages} 
                className={styles.paginationButton}
              >
                Tiếp
              </button>
              
              <span className={styles.pageInfo}>
                Trang {currentPage} / {totalPages} 
                (Hiển thị {currentCourses.length} trong tổng số {filteredCourses.length} khóa học)
              </span>
            </div>
          </>
        ) : (
          <p className={styles.message}>Không tìm thấy khóa học nào khớp với tìm kiếm.</p>
        )}
      </div>
    </AdminLayout>
  );
}

export default CourseManagement;
