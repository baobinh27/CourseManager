import React, { useState, useEffect } from 'react';
import AdminLayout from "./AdminLayout"; // Import the layout component
import styles from './CourseManagement.module.css';
import { useNavigate } from 'react-router-dom';
import { BASE_API } from '../../utils/constant';
import { FaEdit, FaTrashAlt, FaSearch } from 'react-icons/fa';
import { BiLoaderCircle } from 'react-icons/bi';

function CourseManagement() {
  
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(10); // Tăng lên 10 khóa học mỗi trang
  const navigate = useNavigate();

  // State for editing
  const [editingCourse, setEditingCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []); 

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${BASE_API}/api/course/search?query=`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi lấy dữ liệu khóa học");
      }
      
      setCourses(data);
      setFilteredCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

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
        const token = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        
        if (!token) {
          alert("Bạn cần đăng nhập để thực hiện hành động này");
          return;
        }
        
        const response = await fetch(`${BASE_API}/api/course/delete/${courseId}`, {
          method: 'DELETE',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-refresh-token": refreshToken
          },
        });
        
        if (response.status === 401 || response.status === 403) {
          // Token might be expired
          alert("Phiên đăng nhập đã hết hạn hoặc bạn không có quyền xóa khóa học này");
          // Redirect to login if needed
          return;
        }
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Lỗi khi xóa khóa học");
        }
        
        // Update state after successful deletion
        const updatedCourses = courses.filter(course => course.courseId !== courseId);
        setCourses(updatedCourses);
        setFilteredCourses(prevFiltered => prevFiltered.filter(course => course.courseId !== courseId));
        
        alert(`Đã xóa khóa học "${courseName}"`);
      } catch (err) {
        console.error(`Lỗi khi xóa khóa học ${courseId}:`, err);
        alert("Đã xảy ra lỗi khi xóa khóa học: " + err.message);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <AdminLayout>
      <div className={styles.courseManagementContainer}>
        <div className={styles.headerSection}>
          <h1>Quản lý Khóa học</h1>
        </div>

        <div className={styles.filterContainer}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khóa học hoặc tác giả..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <FaSearch className={styles.searchIcon} />
          </div>
        </div>

        {loading ? (
          <div className={styles.message}>
            <BiLoaderCircle className={styles.loadingIcon} />
            <p>Đang tải danh sách khóa học...</p>
          </div>
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
                  <th className={styles.actionsHeader}>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentCourses.map((course) => (
                  <tr key={course._id}>
                    <td className={styles.courseName}>{course.name}</td>
                    <td>{course.author}</td>
                    <td>{formatDate(course.lastModified)}</td>
                    <td className={styles.enrollCount}>{course.enrollCount || 0}</td>
                    <td className={styles.actions}>
                      <button onClick={() => handleEdit(course.courseId)} className={`${styles.actionButton} ${styles.editButton}`}>
                        <FaEdit /> Sửa
                      </button>
                      <button onClick={() => handleDelete(course.courseId, course.name)} className={`${styles.actionButton} ${styles.deleteButton}`}>
                        <FaTrashAlt /> Xóa
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
          <div className={styles.message}>
            <p>Không tìm thấy khóa học nào khớp với tìm kiếm.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default CourseManagement;
