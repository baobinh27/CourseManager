import { useNavigate } from "react-router-dom";
import styles from "./Teaching.module.css";
import teachingBanner from "../../assets/teaching.jpg";
import useIsMobile from "../../hooks/useIsMobile"

const Teaching = () => {
    const navigate = useNavigate();

    const isMobile = useIsMobile('(max-width: 768px)'); 
    const isTablet = useIsMobile('(max-width: 1024px)');

    return (<div className={isTablet ? "flex-col align-center" : "flex-row justify-center"}>
        <div>
            <img src={teachingBanner} className={styles.banner} alt="banner" />
        </div>

        <div className={`${styles.content} flex-col justify-center align-center`}>
            <div className="flex-col align-center" style={{ gap: "1rem" }}>
                <p className={isMobile ? "h5 bold" : "h3"}>Bạn muốn chia sẻ kiến thức của mình?</p>
                <p className={isMobile ? "h4 bold" : "h2"}>Trở thành giảng viên ngay hôm nay!</p>
                <p className={isMobile ? "h6" : "h5"}>Tạo khoá học của riêng bạn dễ dàng trong vài phút.</p>
            </div>

            <div className="flex-col align-center" style={{ gap: "1rem" }}>
                <button className={`${styles["guide-btn"]} ${isTablet ? "h6" : "h4"} bold`} onClick={() => navigate('/teaching/guide')}>Làm sao tôi có thể tạo khoá học?</button>
                <button className={`${styles["start-btn"]} ${isTablet ? "h6" : "h4"} bold`} onClick={() => navigate('/teaching/create')}>Bắt đầu ngay!</button>
            </div>

        </div>

    </div>)
}

export default Teaching;