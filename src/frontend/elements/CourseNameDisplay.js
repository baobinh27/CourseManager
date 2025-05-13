import React, { useState, useEffect } from 'react';
import { BASE_API } from '../utils/constant';

const CourseNameDisplay = ({ courseId }) => {
  const [courseName, setCourseName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseName = async () => {
      if (!courseId) {
        setCourseName('Không có khóa học');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_API}/api/course/courseId/${courseId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });

        if (!response.ok) {
          throw new Error('Không thể tải thông tin khóa học');
        }

        const data = await response.json();
        setCourseName(data.name || 'Không xác định');
      } catch (err) {
        console.error('Error fetching course name:', err);
        setError(err.message);
        setCourseName('Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseName();
  }, [courseId]);

  if (loading) {
    return <span>Đang tải...</span>;
  }

  if (error) {
    return <span title={error}>Lỗi tải dữ liệu</span>;
  }

  return <span>{courseName}</span>;
};

export default CourseNameDisplay; 