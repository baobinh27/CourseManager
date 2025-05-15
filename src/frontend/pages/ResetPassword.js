import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa";
import styles from "./ResetPassword.module.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import useVerifyResetPassword from "../hooks/emails/useVerifyResetPassword";
import { ImWarning } from "react-icons/im";
import { BiLoaderCircle } from "react-icons/bi";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token") || "";

    console.log(token);
    

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        verify: ''
    });

    const { verifyRequest, loading: loadingVerifyRequest, error: verifyRequestError } = useVerifyResetPassword();
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (error) setTimeout(() => setError(null), 5000)
    }, [error])

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.verify) {
            setError("Mật khẩu xác thực không khớp");
            return;
        }
        verifyRequest(token, formData.password, () => {
            setMessage("Thay đổi mật khẩu thành công!");
            setTimeout(() => navigate('/login'), 2000);
        });
    }

    return <div className={styles.pageContainer}>
        <div className={styles.pageBackground}></div>
        <div className={styles.container}>
            <h2 className={styles.title}>Quên mật khẩu</h2>
            <form className="flex-col" style={{ gap: "1.2rem" }} onSubmit={handlePasswordSubmit}>
                <p className="h4">Nhập mật khẩu mới cho tài khoản của bạn</p>
                <div className={styles["form-group"]}>
                    <label htmlFor="password">Mật khẩu</label>
                    <div className={styles["input-field"]}>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handlePasswordChange}
                            placeholder="Nhập mật khẩu"
                        />
                        <button
                            type="button"
                            className={styles["toggle-password"]}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <div className={styles["form-group"]}>
                    <label htmlFor="password">Xác nhận mật khẩu</label>
                    <div className={styles["input-field"]}>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="verify"
                            name="verify"
                            value={formData.verify}
                            onChange={handlePasswordChange}
                            placeholder="Xác nhận mật khẩu"
                        />
                        <button
                            type="button"
                            className={styles["toggle-password"]}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                {error && <div className={`${styles["error-message"]} flex-row align-center`}>
                    <ImWarning />
                    {error}
                </div>}
                {message && <div className={`${styles["error-message"]} flex-row align-center`} style={{backgroundColor: "forestgreen"}}>
                    <FaInfoCircle />
                    {message}
                </div>}
                {verifyRequestError && <div className={`${styles["error-message"]} flex-row align-center`}>
                    <ImWarning />
                    {verifyRequestError}
                </div>}
                <button type="submit" className={`${styles["button"]} ${styles["login-button"]}`}
                    disabled={formData.password === '' || formData.verify === ''}
                    style={{ cursor: formData.password === '' || formData.verify === '' ? "not-allowed" : "pointer" }}
                >
                    {loadingVerifyRequest ? <BiLoaderCircle className={styles["loading-icon"]}/> : "Xác nhận"}
                </button>
            </form>
        </div>
    </div>
}

export default ResetPassword;