import { useState, useEffect } from "react";
import { BASE_API } from "../../utils/constant";

const useGetAllDraftCourses = () => {
    const [drafts, setDrafts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDrafts = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem("accessToken");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(`${BASE_API}/api/draftCourse/allDraftCourses`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch draft courses");
            }

            setDrafts(data);
        } catch (err) {
            console.error("Error fetching draft courses:", err);
            setError(err.message || "Failed to fetch draft courses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrafts();
    }, []);

    return { drafts, loading, error, refetch: fetchDrafts };
};

export default useGetAllDraftCourses; 