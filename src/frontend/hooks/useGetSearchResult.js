import { useEffect, useState } from "react";
import { BASE_API } from "../utils/constant";

const useGetSearchResult = (query) => {
    const [courses, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query || query === "") {
            setCourse(null);
            return;
        }

        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BASE_API}/api/course/search?query=${query}`);
                const data = await response.json();                

                if (!response.ok) {
                    console.log(data.message);
                    throw new Error(data.message || "Lỗi khi lấy dữ liệu khóa học");
                }

                setCourse(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [query]);

    return { courses, loading, error };
};

export default useGetSearchResult;