import { BASE_API } from "../utils/constant";
import { useEffect, useState } from "react";

const useGetUserOrders = () => {
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) return;
            try {
                setLoading(true);
                const response = await fetch(`${BASE_API}/api/order/my-orders/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    console.log(data.message);
                    throw new Error(data.message || "Lỗi khi lấy dữ liệu hoá đơn người dùng");
                }

                setOrders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return { orders, loading, error };
}

export default useGetUserOrders;