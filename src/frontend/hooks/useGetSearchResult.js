import { useState, useCallback } from "react";
import { BASE_API } from "../utils/constant";

const useGetSearchResult = () => {
    const [courses, setCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCourse = useCallback(async ({ query, minPrice, maxPrice, minRating, sortBy }) => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();

            if (query) params.append("query", query);
            if (minPrice) params.append("min", minPrice);
            if (maxPrice) params.append("max", maxPrice);
            if (minRating) params.append("rating", minRating);
            if (sortBy) params.append("sort", sortBy);

            const response = await fetch(`${BASE_API}/api/course/search?${params.toString()}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Lỗi khi lấy dữ liệu khóa học");
            }

            setCourse(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    return { courses, loading, error, fetchCourse };
};

export default useGetSearchResult;
