import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Giả sử bạn có API functions để lấy và cập nhật khóa học
// import { getCourseDetails, updateCourseAdmin } from '../../api/adminApi'; // Ví dụ
import styles from './EditCourse.module.css';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

// Mock function to simulate fetching course details - Thay thế bằng API call thực tế
const fetchMockCourseDetails = async (courseId) => {
  console.log(`(Mock API Call) Fetching details for course: ${courseId}`);
  // Tìm trong mock data hoặc trả về một object giả lập
  const mockCourses = [
    { _id: '1', name: 'Khóa học React cơ bản', author: 'Admin A', description: 'Mô tả cho React...', tags: ['React', 'Frontend'], price: 500000, banner: 'https://example.com/react.jpg', content: [] },
    { _id: '2', name: 'Node.js cho người mới bắt đầu', author: 'Giảng viên B', description: 'Mô tả cho Node.js...', tags: ['Nodejs', 'Backend'], price: 450000, banner: 'https://example.com/node.jpg', content: [] },
    { _id: '3', name: 'Thiết kế Web nâng cao', author: 'Admin A', description: 'Mô tả Web nâng cao...', tags: ['HTML', 'CSS', 'JavaScript'], price: 600000, banner: 'https://example.com/web.jpg', content: [] },
  ];
  // Giả lập độ trễ mạng
  await new Promise(resolve => setTimeout(resolve, 500));
  const course = mockCourses.find(c => c._id === courseId);
  if (!course) {
    throw new Error('Course not found');
  }
  // Thêm các trường có thể thiếu từ mock data gốc
  return {
      enrolCount: 100, // Giá trị giả lập
      lastModified: new Date().toISOString(), // Giá trị giả lập
      ratings: [], // Giá trị giả lập
      ...course,
      tags: course.tags.join(', '), // Chuyển array tags thành string để dễ edit trong input
  };
};

// Mock function to simulate updating course - Thay thế bằng API call thực tế
const updateMockCourse = async (courseId, courseData) => {
  console.log(`(Mock API Call) Updating course ${courseId} with data:`, courseData);
  // Giả lập độ trễ mạng
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Trong ứng dụng thực tế, bạn sẽ gửi PUT/PATCH request lên server
  // Server sẽ trả về course đã được cập nhật hoặc status thành công
  return { ...courseData, _id: courseId, lastModified: new Date().toISOString() };
};


function EditCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  useDocumentTitle(`Chỉnh sửa Khóa học - ${courseId}`); // Optional

  const [courseData, setCourseData] = useState({
    name: '',
    author: '', // Author có thể không cho sửa hoặc chỉ admin cấp cao mới được sửa
    description: '',
    tags: '', // Lưu dạng string ngăn cách bởi dấu phẩy
    price: 0,
    banner: '',
    // Thêm các trường khác nếu cần: content, v.v.
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCourseDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        // --- TODO: Thay thế bằng API call thực tế ---
        // const data = await getCourseDetails(courseId);
        const data = await fetchMockCourseDetails(courseId);
        // --- Kết thúc phần TODO ---

        // Chuyển đổi tags array thành string nếu API trả về array
        if (Array.isArray(data.tags)) {
            data.tags = data.tags.join(', ');
        }

        setCourseData(data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết khóa học:", err);
        setError("Không thể tải thông tin khóa học hoặc khóa học không tồn tại.");
      } finally {
        setLoading(false);
      }
    };

    loadCourseDetails();
  }, [courseId]);

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    setCourseData(prevData => ({
      ...prevData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Chuẩn bị dữ liệu gửi đi, chuyển tags từ string lại thành array
      const dataToSend = {
        ...courseData,
        tags: courseData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''), // Tách string thành array, loại bỏ tag rỗng
      };

      // --- TODO: Thay thế bằng API call thực tế ---
      // await updateCourseAdmin(courseId, dataToSend);
      await updateMockCourse(courseId, dataToSend);
       // --- Kết thúc phần TODO ---

      alert('Cập nhật khóa học thành công!');
      navigate('/admin/courses'); // Quay lại trang quản lý sau khi cập nhật
    } catch (err) {
      console.error("Lỗi khi cập nhật khóa học:", err);
      setError("Đã xảy ra lỗi khi cập nhật khóa học.");
      setIsSubmitting(false);
    }
    // Không cần setIsSubmitting(false) ở đây nếu navigate thành công
  };

  const handleCancel = () => {
    navigate('/admin/courses'); // Quay lại trang quản lý
  };

  if (loading) {
    return <div className={styles.message}>Đang tải thông tin khóa học...</div>;
  }

  if (error) {
    return <div className={`${styles.message} ${styles.error}`}>{error}</div>;
  }

  return (
    <div className={styles.editCourseContainer}>
      <h1>Chỉnh sửa Khóa học: {courseData.name}</h1>
      <form onSubmit={handleSubmit} className={styles.editForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Tên Khóa Học</label>
          <input
            type="text"
            id="name"
            name="name"
            value={courseData.name}
            onChange={handleChange}
            required
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="author">Tác Giả</label>
          <input
            type="text"
            id="author"
            name="author"
            value={courseData.author}
            onChange={handleChange}
            // disabled // Xem xét có cho sửa tác giả không
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Mô Tả</label>
          <textarea
            id="description"
            name="description"
            value={courseData.description}
            onChange={handleChange}
            rows="5"
            required
            className={styles.formTextarea}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tags">Tags (ngăn cách bởi dấu phẩy)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={courseData.tags}
            onChange={handleChange}
            placeholder="Ví dụ: react, javascript, web development"
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price">Giá (VNĐ)</label>
          <input
            type="number"
            id="price"
            name="price"
            value={courseData.price}
            onChange={handleChange}
            min="0"
            required
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="banner">URL Ảnh Banner</label>
          <input
            type="url"
            id="banner"
            name="banner"
            value={courseData.banner}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className={styles.formInput}
          />
        </div>

        {/* Thêm các trường input khác nếu cần (ví dụ: upload nội dung) */}

        {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

        <div className={styles.formActions}>
          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          <button type="button" onClick={handleCancel} className={styles.cancelButton} disabled={isSubmitting}>
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCourse;

