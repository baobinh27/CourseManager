import { useState, useEffect, useCallback } from "react";
import { BASE_API } from "../../utils/constant";

const useGetDraftCourse = (courseId, skipInitialFetch = false) => {
    const [draft, setDraft] = useState(null);
    const [loading, setLoading] = useState(!skipInitialFetch);
    const [error, setError] = useState(null);

    const fetchDraft = useCallback(async (id = courseId) => {
        if (!id) return;
        
        try {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem("accessToken");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(`${BASE_API}/api/draftCourse/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch draft course");
            }

            setDraft(data);
        } catch (err) {
            console.error("Error fetching draft course:", err);
            setError(err.message || "Failed to fetch draft course");
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    useEffect(() => {
        if (!skipInitialFetch && courseId) {
            fetchDraft();
        }
    }, [courseId, skipInitialFetch, fetchDraft]);

    return { draft, loading, error, fetchDraft };
};

export default useGetDraftCourse; 