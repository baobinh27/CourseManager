import React, { useState, useEffect } from 'react';
import { BASE_API } from '../utils/constant';

const CourseNameByID = ({ courseId, className = '', maxLength }) => {
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
        if (data && data.name) {
          let displayName = data.name;
          if (maxLength && displayName.length > maxLength) {
            displayName = displayName.substring(0, maxLength) + '...';
          }
          setCourseName(displayName);
        } else {
          setCourseName('Khóa học không xác định');
        }
      } catch (err) {
        console.error('Error fetching course name:', err);
        setError(err.message);
        setCourseName('Lỗi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseName();
  }, [courseId, maxLength]);

  if (loading) {
    return <span className={className}>Đang tải...</span>;
  }

  if (error) {
    return <span className={className} title={error}>Lỗi tải dữ liệu</span>;
  }

  return <span className={className} title={courseName}>{courseName}</span>;
};

export default CourseNameByID; 