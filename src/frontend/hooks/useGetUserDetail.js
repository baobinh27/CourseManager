import { BASE_API } from "../utils/constant";
import { useEffect, useState } from "react";

const useGetUserDetail = (userId) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${BASE_API}/api/user/${userId}`);
                const data = await response.json();                

                if (!response.ok) {
                    console.log(data.message);
                    throw new Error(data.message || "Lỗi khi lấy dữ liệu người dùng");
                }

                setUser(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
    
        if (userId) {
            fetchCourse();
        }
    }, [userId]);
    
    return { user, loading, error };
}

export default useGetUserDetail;