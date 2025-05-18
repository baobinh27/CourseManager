import { useEffect, useState } from "react";
import { BASE_API } from "../utils/constant";

const useGetMultipleCourseDetails = (courseIds) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        setLoading(true);

        const promises = courseIds.map(id =>
          fetch(`${BASE_API}/api/course/courseId/${id}`, {
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            }
          }).then(res => res.json())
        );

        const results = await Promise.all(promises);

        // Optional: filter các khóa học bị lỗi hoặc không tồn tại
        const validCourses = results.filter(course => course && course.courseId);

        setCourses(validCourses);
      } catch (err) {
        setError("Lỗi khi tải danh sách khóa học");
      } finally {
        setLoading(false);
      }
    };

    if (courseIds && courseIds.length > 0) {
      fetchCourses();
    }
    if (courseIds.length === 0) setLoading(false);
  }, [courseIds]);

  return { courses, loading, error };
};

export default useGetMultipleCourseDetails;
