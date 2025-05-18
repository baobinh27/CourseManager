import { useSearchParams } from "react-router-dom";
import useCreateOrder from "../hooks/useCreateOrder";
import { useState } from "react";
import useGetCourseDetail from "../hooks/useGetCourseDetail";
import styles from "./Purchase.module.css";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";
import useIsMobile from "../hooks/useIsMobile";
import QrCode from "../assets/unauthorized.png";
import { FaInfoCircle } from "react-icons/fa";
import { IoWarning } from "react-icons/io5";

const Purchase = () => {
    const [searchParams] = useSearchParams();

    const courseId = searchParams.get("courseId") || "";
    const { course, loading: loadingCourse, error: courseError } = useGetCourseDetail(courseId);

    const [note, setNote] = useState("");

    const isTablet = useIsMobile('(max-width: 1024px)');

    const { createOrder, loading: loadingOrder, error: orderError, success } = useCreateOrder();

    const handleOrderSubmit = async () => {
        await createOrder(courseId, course.price, 'bank_tranfer', 'unused now', note);
    }

    if (loadingCourse || loadingOrder) return <Loading />

    if (courseError) return <ErrorPage message={courseError} />

    return <div className={`${styles.container} ${isTablet ? "flex-col justify-center" : "flex-row align-center justify-between"}`}>
        <div>
            <div className={styles.courseInfo}>
                <img src={course.banner} alt={course.name} className={styles.banner} />
                <h2 className={styles.courseName}>{course.name}</h2>
            </div>

            <div className={styles.priceBox}>
                <span>Tổng cộng:</span>
                <strong>{course.price.toLocaleString()}₫</strong>
            </div>
        </div>

        <div>
            <div className={styles.qrBox}>
                <p>Quét mã QR để thanh toán</p>
                <img
                    src={QrCode}
                    alt="QR Code"
                    className={styles.qrImage}
                />
            </div>

            <div className={styles.noteBox}>
                <label htmlFor="note">Lời nhắn</label>
                <input
                    id="note"
                    type="text"
                    placeholder="Nhập lời nhắn (nếu có)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </div>

            {success && <div
                className="flex-row align-center"
                style={{
                    backgroundColor: "rgba(34, 139, 34, 0.5)",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    color: "white",
                    gap: "0.5rem"
                }}
            >
                <FaInfoCircle />
                Tạo hoá đơn thành công!
            </div>}

            {orderError && <div
                className="flex-row align-center"
                style={{
                    backgroundColor: "rgba(255, 0, 0, 0.5)",
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    color: "white",
                    gap: "0.5rem"
                }}>
                <IoWarning />
                Lỗi: {orderError}
            </div>}

            <button className={styles.confirmButton} onClick={handleOrderSubmit}>
                Xác nhận tạo hoá đơn
            </button>
        </div>
    </div>
}

export default Purchase;