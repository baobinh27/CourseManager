import { useState, useEffect } from "react";
import { BASE_API } from "../../utils/constant";

const useGetCourseReviews = (courseId) => {
    const [reviews, setReviews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);

                const response = await fetch(`${BASE_API}/api/review/course/${courseId}`);
                const data = await response.json();                

                if (!response.ok) {
                    console.log(data.message);
                    throw new Error(data.message || "Lỗi khi lấy dữ liệu đánh giá");
                }

                setReviews(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (courseId) {
            fetchReviews();
        }
    }, [courseId]);

    return { reviews, loading, error };
}

export default useGetCourseReviews;