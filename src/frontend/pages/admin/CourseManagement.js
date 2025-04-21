import React, { useState, useEffect } from 'react';
import AdminLayout from "./AdminLayout"; // Import the layout component
import styles from './CourseManagement.module.css';
import { useNavigate } from 'react-router-dom';

// Mock data - Replace with actual API call
const mockCourses = [
  { _id: '1', name: 'Khóa học React cơ bản', author: 'Admin A', lastModified: '2024-01-15T10:00:00Z', enrolCount: 150 },
  { _id: '2', name: 'Node.js cho người mới bắt đầu', author: 'Giảng viên B', lastModified: '2024-02-20T14:30:00Z', enrolCount: 95 },
  { _id: '3', name: 'Thiết kế Web nâng cao', author: 'Admin A', lastModified: '2024-03-10T09:15:00Z', enrolCount: 210 },
];

function CourseManagement() {
  
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  }, [searchTerm, courses]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleViewDetails = (courseId) => {
    navigate(`/courses/${courseId}`);
  };

  const handleEdit = (courseId) => {
    navigate(`/admin/edit-course/${courseId}`); 
  };

  const handleCreateCourse = () => {
    navigate('/admin/create-course'); // Navigate to the create course page
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
        <div className={styles.headerSection}> {/* Added a wrapper div for H1 and Button */} 
          <h1>Quản lý Khóa học</h1>
          <button onClick={handleCreateCourse} className={`${styles.actionButton} ${styles.createButton}`}> {/* Add Create Button */}
            + Tạo khóa học
          </button>
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
              {filteredCourses.map((course) => (
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
        ) : (
          <p className={styles.message}>Không tìm thấy khóa học nào khớp với tìm kiếm.</p>
        )}
      </div>
    </AdminLayout>
  );
}

export default CourseManagement;
