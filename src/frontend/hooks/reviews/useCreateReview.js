import { useState } from "react";
import { BASE_API } from "../../utils/constant";

const useCreateReview = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createReview = async (data) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            const response = await fetch(`${BASE_API}/api/review/`, {
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
                throw new Error(responseData.message || "Lỗi khi tạo bình luận");
            }
            setSuccess(true);
            return responseData;
        } catch (err) {
            console.error('Error creating review:', err);
            setError(err.message || 'Network error');
        } finally {
            setLoading(false);
        }
    }

    return { createReview, loading, error, success };
};

export default useCreateReview;