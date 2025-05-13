import { useNavigate } from "react-router-dom";
import banner from "../../assets/signin-g.svg";
import styles from "./LoginRequired.module.css";

const LoginRequired = () => {
    const navigate = useNavigate();

    return <div className={`${styles.container} flex-col align-center`}>
        <p className="h2">Hãy đăng nhập để sử dụng tính năng này.</p>
        <img className={styles.banner} src={banner} alt="" />
        <button onClick={() => navigate('/login')} className={`${styles.button} h4 bold`}>Đăng nhập</button>
    </div>
}

export default LoginRequired;