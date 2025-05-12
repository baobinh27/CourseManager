import { useState } from "react";
import { BASE_API } from "../../utils/constant";

const useCreateDraftCourse = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createDraftCourse = async (data) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            const response = await fetch(`${BASE_API}/api/draftCourse/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.log(responseData.message);
                throw new Error(responseData.message || "Lỗi khi tạo khóa học");
            }
            setSuccess(true);
            return responseData;
        } catch (err) {
            console.error('Error creating draft:', err);
            setError(err.message || 'Network error');
        } finally {
            setLoading(false);
        }
    }

    return { createDraftCourse, loading, error, success };
};

export default useCreateDraftCourse;