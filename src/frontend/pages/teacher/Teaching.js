import { useNavigate } from "react-router-dom";
import styles from "./Teaching.module.css";
import teachingBanner from "../../assets/teaching.jpg";

const Teaching = () => {
    const navigate = useNavigate();

    return (<div className="flex-row">
        <div>
            <img src={teachingBanner} className={styles.banner} alt="banner" />
        </div>

        <div className={`${styles.content} flex-col justify-center align-center`}>
            <div className="flex-col align-center" style={{ gap: "1vw" }}>
                <p className="h3">Bạn muốn chia sẻ kiến thức của mình?</p>
                <p className="h2">Trở thành giảng viên ngay hôm nay!</p>
                <p className="h5">Tạo khoá học của riêng bạn dễ dàng trong vài phút.</p>
            </div>

            <div className="flex-col align-center" style={{ gap: "1vw" }}>
                <button className={`${styles["guide-btn"]} h4 bold`} onClick={() => navigate('/teaching/guide')}>Làm sao tôi có thể tạo khoá học?</button>
                <button className={`${styles["start-btn"]} h4 bold`} onClick={() => navigate('/teaching/create')}>Bắt đầu ngay!</button>
            </div>

        </div>

    </div>)
}

export default Teaching;