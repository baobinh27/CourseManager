import styles from "./MyOrders.module.css";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";
import useIsMobile from "../hooks/useIsMobile";
import useGetUserOrders from "../hooks/useGetUserOrders";

function formatPaymentMethod(method) {
    switch (method) {
        case 'bank_tranfer': return 'Chuyển khoản ngân hàng';
        case 'momo': return 'Momo';
        case 'zalo_pay': return 'ZaloPay';
        default: return method;
    }
}

function formatStatus(status) {
    switch (status) {
        case 'pending': return <div style={{ display: "inline", backgroundColor: "#ddd", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", color: "black", fontSize: "0.8rem" }}>Đang chờ duyệt</div>;
        case 'approved': return <div style={{ display: "inline", backgroundColor: "rgba(34, 139, 34, 0.75)", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", color: "white", fontSize: "0.8rem" }}>Đã duyệt</div>;
        case 'rejected': return <div style={{ display: "inline", backgroundColor: "rgba(255, 0, 0, 0.75)", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", color: "white", fontSize: "0.8rem" }}>Bị từ chối</div>;
        default: return status;
    }
}

function MyOrders() {
    const { orders, loading: loadingOrders, error: ordersError } = useGetUserOrders();

    const isMobile = useIsMobile('(max-width: 768px)');

    if (loadingOrders) return <Loading />

    if (ordersError) return <ErrorPage message={ordersError} />

    return (
        <div className={`${styles.container} flex-col align-center`}>
            <section className={styles.section}>
                <h2 className={`${styles.sectionTitle} ${isMobile ? "h4" : "h2"}`}>Đơn hàng của bạn</h2>
                {orders.length === 0 && <p className={styles.noOrders}>Bạn chưa có đơn hàng nào.</p>}
                <div className={styles.ordersList}>
                {orders.map((order) => (
                    <div key={order._id} className={styles.orderCard}>
                        <div className={styles.courseInfo}>
                            <img src={order.courseId.banner} alt="course banner" className={styles.courseBanner} />
                            <div className={`${styles.courseDetails} truncate`}>
                                <h3 className={`${styles.courseName} truncate`}>{order.courseId.name}</h3>
                                <p className={styles.createdAt}>
                                    Ngày tạo: {order.createdAt?.slice(0, 10).split('-').reverse().join('/')}
                                </p>
                            </div>
                        </div>
                        <div className={styles.orderDetails}>
                            <p><strong>Số tiền:</strong> {order.amount.toLocaleString()} đ</p>
                            <p><strong>Phương thức:</strong> {formatPaymentMethod(order.paymentMethod)}</p>
                            <div><strong>Trạng thái:</strong> {formatStatus(order.status)}</div>
                            {order.note && <p><strong>Lời nhắn:</strong> {order.note}</p>}
                        </div>
                    </div>
                ))}
            </div>
            </section>
        </div>
    );
}

export default MyOrders;