import { FaChevronLeft } from 'react-icons/fa';
import styles from './GuidePage.module.css';
import { useNavigate } from 'react-router-dom';

const GuidePage = () => {
    const navigate = useNavigate();

    return (<>
        <button className={`${styles.button} h6 flex-row align-center bold`} onClick={() => navigate('/teaching/')}>
            <FaChevronLeft />
            Quay lại
        </button>
        <div className={styles.pageContainer}>
            <h1 className={styles.title}>Hướng dẫn tạo khoá học</h1>

            <section className={styles.section}>
                <h2 className={styles.subtitle}>1. Nhập thông tin cơ bản</h2>
                <p className={styles.text}>
                    Bắt đầu bằng việc điền tên khoá học, mô tả ngắn gọn (dưới 100 từ) và giá bán cho khoá học của bạn.
                    Hãy chắc chắn rằng tên và mô tả dễ hiểu, hấp dẫn để thu hút học viên.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.subtitle}>2. Chọn thẻ phù hợp</h2>
                <p className={styles.text}>
                    Gán tối đa 5 thẻ (tags) liên quan đến chủ đề khoá học của bạn để người học dễ dàng tìm kiếm.
                    Ví dụ: "Lập trình", "Thiết kế", "Kinh doanh".
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.subtitle}>3. Thêm banner</h2>
                <p className={styles.text}>
                    Cung cấp link hình ảnh cho banner khoá học. Banner nên rõ ràng, đẹp mắt, kích thước đề xuất là 1280x720px.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.subtitle}>4. Xây dựng nội dung khoá học</h2>
                <p className={styles.text}>
                    Khoá học của bạn sẽ được chia thành các chương. Trong mỗi chương, bạn có thể thêm các video bằng cách nhập link video.
                    Bạn cũng có thể dễ dàng thêm mới hoặc xoá các chương và video.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.subtitle}>5. Hoàn tất và đăng khoá học</h2>
                <p className={styles.text}>
                    Sau khi hoàn thiện, hãy nhấn nút "Tạo khoá học" để lưu lại. Khoá học sẽ được kiểm duyệt và hiển thị trên hệ thống sau khi được phê duyệt.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.heading}>📌 Một số lưu ý</h2>
                <ul className={styles.list}>
                    <li>Đảm bảo nội dung không vi phạm bản quyền.</li>
                    <li>Chắc chắn rằng chất lượng hình ảnh và âm thanh của video ổn định.</li>
                    <li>Mô tả và tiêu đề cần trung thực với nội dung bài giảng.</li>
                </ul>
            </section>

            <div className={styles.buttonContainer}>
                <button className={`${styles.button} h4 bold`} onClick={() => navigate('/teaching/create')}>
                    Bắt đầu tạo khoá học
                </button>
            </div>

        </div>
    </>);
};

export default GuidePage;
