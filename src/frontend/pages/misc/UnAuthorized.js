import styles from "./UnAuthorized.module.css";
import banner from "../../assets/unauthorized.png";
import { useNavigate } from "react-router-dom";

const UnAuthorized = () => {
    const navigate = useNavigate();

    return <div className={`${styles.container} flex-col align-center`} style={{height: "90vh"}}>
        <p className="h2">Bạn không có quyền truy cập vào trang này.</p>
        <img className={styles.banner} src={banner} alt="" />
        <button onClick={() => navigate('/')} className={`${styles.button} h4 bold`}>Quay lại trang chủ</button>
    </div>
}

export default UnAuthorized;