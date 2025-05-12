import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { BASE_API } from '../../utils/constant';
import styles from './EditCourse.module.css';
import { FaChevronLeft, FaPlus, FaSave } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { BiLoaderCircle } from 'react-icons/bi';

const EditCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [course, setCourse] = useState({
    name: '',
    author: '',
    description: '',
    price: 0,
    tags: [],
    banner: '',
    content: []
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Bạn cần đăng nhập để chỉnh sửa khóa học');
          return;
        }

        const response = await fetch(`${BASE_API}/api/course/courseId/${courseId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Lỗi khi lấy thông tin khóa học');
        }

        setCourse(data);
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu khóa học');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({
      ...course,
      [name]: name === 'price' ? Number(value) : value
    });
  };

  const addTag = () => {
    if (!tagInput || course.tags.includes(tagInput)) return;
    setCourse({
      ...course,
      tags: [...course.tags, tagInput]
    });
    setTagInput('');
  };

  const removeTag = (tagToRemove) => {
    setCourse({
      ...course,
      tags: course.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const addSection = () => {
    setCourse({
      ...course,
      content: [
        ...course.content, 
        { sectionTitle: '', sectionContent: [] }
      ]
    });
  };

  const removeSection = (index) => {
    const updatedContent = [...course.content];
    updatedContent.splice(index, 1);
    setCourse({
      ...course,
      content: updatedContent
    });
  };

  const updateSectionTitle = (index, title) => {
    const updatedContent = [...course.content];
    updatedContent[index].sectionTitle = title;
    setCourse({
      ...course,
      content: updatedContent
    });
  };

  const addVideo = (sectionIndex) => {
    const updatedContent = [...course.content];
    updatedContent[sectionIndex].sectionContent.push({
      videoId: '',
      title: '',
      duration: ''
    });
    setCourse({
      ...course,
      content: updatedContent
    });
  };

  const removeVideo = (sectionIndex, videoIndex) => {
    const updatedContent = [...course.content];
    updatedContent[sectionIndex].sectionContent.splice(videoIndex, 1);
    setCourse({
      ...course,
      content: updatedContent
    });
  };

  const updateVideo = (sectionIndex, videoIndex, field, value) => {
    const updatedContent = [...course.content];
    updatedContent[sectionIndex].sectionContent[videoIndex][field] = value;
    setCourse({
      ...course,
      content: updatedContent
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccessMessage('');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập để cập nhật khóa học');
        return;
      }

      const response = await fetch(`${BASE_API}/api/course/update/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(course)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Lỗi khi cập nhật khóa học');
      }

      setSuccessMessage('Cập nhật khóa học thành công!');
      setTimeout(() => {
        navigate('/admin/course-management');
      }, 2000);
    } catch (err) {
      console.error('Error updating course:', err);
      setError(err.message || 'Đã xảy ra lỗi khi cập nhật khóa học');
    } finally {
      setSubmitting(false);
    }
  };

  const goBack = () => {
    navigate('/admin/course-management');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className={styles.loadingContainer}>
          <BiLoaderCircle className={styles.loadingIcon} />
          <p>Đang tải thông tin khóa học...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className={styles.errorContainer}>
          <h2>Lỗi</h2>
          <p>{error}</p>
          <button onClick={goBack} className={styles.backButton}>
            <FaChevronLeft /> Quay lại
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className={styles.editCourseContainer}>
        <div className={styles.headerSection}>
          <button onClick={goBack} className={styles.backButton}>
            <FaChevronLeft /> Quay lại
          </button>
          <h1>Chỉnh sửa khóa học</h1>
        </div>

        {successMessage && (
          <div className={styles.successMessage}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.courseForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Tên khóa học</label>
            <input
              type="text"
              id="name"
              name="name"
              value={course.name}
              onChange={handleChange}
              required
              className={styles.formControl}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="author">Tác giả</label>
            <input
              type="text"
              id="author"
              name="author"
              value={course.author}
              onChange={handleChange}
              required
              className={styles.formControl}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              value={course.description}
              onChange={handleChange}
              rows={5}
              required
              className={styles.formControl}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price">Giá (VND)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={course.price}
              onChange={handleChange}
              min={0}
              required
              className={styles.formControl}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="banner">URL Ảnh bìa</label>
            <input
              type="url"
              id="banner"
              name="banner"
              value={course.banner}
              onChange={handleChange}
              required
              className={styles.formControl}
            />
            {course.banner && (
              <div className={styles.bannerPreview}>
                <img src={course.banner} alt="Banner preview" />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Tags</label>
            <div className={styles.tagsContainer}>
              {course.tags.map((tag, index) => (
                <div key={index} className={styles.tag}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className={styles.removeTagButton}
                  >
                    <FaXmark />
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.tagInputContainer}>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tag và nhấn Enter"
                className={styles.formControl}
              />
              <button
                type="button"
                onClick={addTag}
                className={styles.addTagButton}
              >
                Thêm Tag
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Nội dung khóa học</label>
            <div className={styles.sectionsContainer}>
              {course.content.map((section, sectionIndex) => (
                <div key={sectionIndex} className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <input
                      type="text"
                      value={section.sectionTitle}
                      onChange={(e) => updateSectionTitle(sectionIndex, e.target.value)}
                      placeholder="Tiêu đề phần"
                      className={styles.sectionTitle}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      className={styles.removeSectionButton}
                    >
                      <FaXmark />
                    </button>
                  </div>

                  <div className={styles.videosContainer}>
                    {section.sectionContent.map((video, videoIndex) => (
                      <div key={videoIndex} className={styles.videoItem}>
                        <input
                          type="text"
                          value={video.videoId}
                          onChange={(e) => updateVideo(sectionIndex, videoIndex, 'videoId', e.target.value)}
                          placeholder="ID video YouTube"
                          className={styles.videoInput}
                          required
                        />
                        <input
                          type="text"
                          value={video.title}
                          onChange={(e) => updateVideo(sectionIndex, videoIndex, 'title', e.target.value)}
                          placeholder="Tiêu đề video"
                          className={styles.videoInput}
                          required
                        />
                        <input
                          type="text"
                          value={video.duration}
                          onChange={(e) => updateVideo(sectionIndex, videoIndex, 'duration', e.target.value)}
                          placeholder="Thời lượng (PT5M30S)"
                          className={styles.videoInput}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeVideo(sectionIndex, videoIndex)}
                          className={styles.removeVideoButton}
                        >
                          <FaXmark />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addVideo(sectionIndex)}
                      className={styles.addVideoButton}
                    >
                      <FaPlus /> Thêm video
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addSection}
                className={styles.addSectionButton}
              >
                <FaPlus /> Thêm phần mới
              </button>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={goBack}
              className={styles.cancelButton}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <BiLoaderCircle className={styles.loadingIcon} /> Đang lưu...
                </>
              ) : (
                <>
                  <FaSave /> Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditCourse; 