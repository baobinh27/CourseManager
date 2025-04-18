import React, { useState, useEffect } from 'react';
// Giả sử bạn có API functions để lấy và xóa khóa học (cần tạo hoặc điều chỉnh)
// import { getAllCoursesAdmin, deleteCourseAdmin } from '../../api/adminApi'; // Ví dụ tên hàm API
import styles from './CourseManagement.module.css';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle'; // Optional: Hook để set title trang

// Mock data - Thay thế bằng API call thực tế
const mockCourses = [
  { _id: '1', name: 'Khóa học React cơ bản', author: 'Admin A', lastModified: '2024-01-15T10:00:00Z', enrolCount: 150 },
  { _id: '2', name: 'Node.js cho người mới bắt đầu', author: 'Giảng viên B', lastModified: '2024-02-20T14:30:00Z', enrolCount: 95 },
  { _id: '3', name: 'Thiết kế Web nâng cao', author: 'Admin A', lastModified: '2024-03-10T09:15:00Z', enrolCount: 210 },
];

function CourseManagement() {
  useDocumentTitle('Quản lý Khóa học - Admin'); // Optional
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // --- TODO: Thay thế bằng API call thực tế ---
    // const fetchCourses = async () => {
    //   try {
    //     setLoading(true);
    //     // const data = await getAllCoursesAdmin(); // Gọi API lấy tất cả khóa học
    //     const data = mockCourses; // Sử dụng mock data
    //     setCourses(data);
    //     setFilteredCourses(data);
    //     setError(null);
    //   } catch (err) {
    //     console.error("Lỗi khi tải danh sách khóa học:", err);
    //     setError("Không thể tải danh sách khóa học.");
    //     setCourses([]);
    //     setFilteredCourses([]);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchCourses();

    // Sử dụng mock data trực tiếp
    setCourses(mockCourses);
    setFilteredCourses(mockCourses);
    setLoading(false);
     // --- Kết thúc phần TODO ---

  }, []); // Chạy 1 lần khi component mount

  useEffect(() => {
    // Lọc khóa học khi searchTerm thay đổi
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
    // Chuyển hướng đến trang chi tiết khóa học (có thể là trang chi tiết chung)
    navigate(`/courses/${courseId}`); // Giả sử URL là /courses/:id
    console.log(`Xem chi tiết khóa học: ${courseId}`);
  };

  const handleEdit = (courseId) => {
    // Chuyển hướng đến trang chỉnh sửa khóa học (cần tạo trang này)
    navigate(`/admin/edit-course/${courseId}`); // Ví dụ URL
    console.log(`Chỉnh sửa khóa học: ${courseId}`);
  };

  const handleDelete = async (courseId, courseName) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khóa học "${courseName}" không? Hành động này không thể hoàn tác.`)) {
      try {
        // --- TODO: Thay thế bằng API call thực tế ---
        // await deleteCourseAdmin(courseId); // Gọi API xóa
        console.log(`(API Call) Xóa khóa học: ${courseId}`);
         // --- Kết thúc phần TODO ---

        // Cập nhật lại danh sách sau khi xóa thành công
        const updatedCourses = courses.filter(course => course._id !== courseId);
        setCourses(updatedCourses);
        alert(`Đã xóa khóa học "${courseName}"`);
      } catch (err) {
        console.error(`Lỗi khi xóa khóa học ${courseId}:`, err);
        alert("Đã xảy ra lỗi khi xóa khóa học.");
      }
    }
  };

  if (loading) {
    return <div className={styles.message}>Đang tải danh sách khóa học...</div>;
  }

  if (error) {
    return <div className={`${styles.message} ${styles.error}`}>{error}</div>;
  }

  return (
    <div className={styles.courseManagementContainer}>
      <h1>Quản lý Khóa học</h1>

      <div className={styles.filterContainer}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên khóa học hoặc tác giả..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
      </div>

      {filteredCourses.length > 0 ? (
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
        <p className={styles.message}>Không tìm thấy khóa học nào.</p>
      )}
    </div>
  );
}

export default CourseManagement;
