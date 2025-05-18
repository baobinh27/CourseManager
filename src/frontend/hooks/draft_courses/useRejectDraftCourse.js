import { useState } from "react";
import { BASE_API } from "../../utils/constant";

const useRejectDraftCourse = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const rejectCourse = async (courseId) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            
            const token = localStorage.getItem("accessToken");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await fetch(`${BASE_API}/api/draftCourse/reject/${courseId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to reject course");
            }

            setSuccess(true);
            return data;
        } catch (err) {
            console.error("Error rejecting course:", err);
            setError(err.message || "Failed to reject course");
        } finally {
            setLoading(false);
        }
    };

    return { rejectCourse, loading, error, success };
};

export default useRejectDraftCourse; 