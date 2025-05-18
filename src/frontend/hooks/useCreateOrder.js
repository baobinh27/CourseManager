import { useState } from "react";
import { BASE_API } from "../utils/constant";

const useCreateOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const createOrder = async (courseId, amount, paymentMethod = 'bank_tranfer', paymentProof = 'unused now', note) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            const response = await fetch(`${BASE_API}/api/order/enroll`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ courseId, amount, paymentMethod, paymentProof, note }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                console.log(responseData.message);
                throw new Error(responseData.message || "Lỗi khi tạo đơn hàng");
            }
            setSuccess(true);
            return responseData;
        } catch (err) {
            console.error('Error creating order:', err);
            setError(err.message || 'Network error');
        } finally {
            setLoading(false);
        }
    }

    return { createOrder, loading, error, success };
};

export default useCreateOrder;