import { BASE_API } from "../utils/constant";
import { useEffect, useState } from "react";

const useGetAdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchOrders = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        try {
            setLoading(true);
            const response = await fetch(`${BASE_API}/api/order/all-orders/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(errorData.message);
                throw new Error(errorData.message || "Lỗi khi lấy danh sách đơn hàng");
            }

            const data = await response.json();
            setOrders(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const processOrder = async (orderId, action, noteFromAdmin) => {
        const token = localStorage.getItem("accessToken");
        if (!token) return false;
        try {
            setLoading(true);
            const response = await fetch(`${BASE_API}/api/order/process/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ action, noteFromAdmin }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Không thể ${action === 'approve' ? 'duyệt' : 'từ chối'} đơn hàng`);
            }

            // Cập nhật danh sách đơn hàng sau khi xử lý
            await fetchOrders();
            return true;
        } catch (err) {
            setError(err.message);
            console.error('Error processing order:', err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { orders, loading, error, processOrder, fetchOrders };
};

export default useGetAdminOrders; 