import { useState } from "react";
import { BASE_API } from "../../utils/constant";

const useVerifyResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const verifyRequest = async (token, newPassword, onSuccess = () => {}) => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${BASE_API}/api/email/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword })
            });
            const data = await response.json();

            if (!response.ok) {
                console.log(data.message);
                throw new Error(data.message || "Lỗi khi gửi email");
            }
            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return { verifyRequest, loading, error };
}

export default useVerifyResetPassword;