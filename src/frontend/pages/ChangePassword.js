import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaInfoCircle } from "react-icons/fa";
import styles from "./ChangePassword.module.css";
import { useNavigate } from "react-router-dom";
import { ImWarning } from "react-icons/im";
import { BiLoaderCircle } from "react-icons/bi";
import useChangePassword from "../hooks/useChangePassword";
import { useAuth } from "../api/auth";
import useGetUserDetail from "../hooks/useGetUserDetail";
import Loading from "./misc/Loading";
import ErrorPage from "./misc/ErrorPage";

const ChangePassword = () => {
    const navigate = useNavigate();

    const { user } = useAuth();

    const { user: userData, loading: loadingUser, error: userError } = useGetUserDetail(user?.userId);

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        old: '',
        password: '',
        verify: ''
    });

    const { changePassword, loading: loadingChangePassword, error: changePasswordError } = useChangePassword();
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
        changePassword(userData.email, formData.old, formData.password, () => {
            setMessage("Thay đổi mật khẩu thành công!");
            setTimeout(() => navigate('/'), 2000);
        })
    }

    if (loadingUser) return <Loading />

    if (userError) return <ErrorPage message={userError}/>

    return <div className={styles.pageContainer}>
        {/* <div className={styles.pageBackground}></div> */}
        <div className={styles.container}>
            <h2 className={`${styles.title} h2`}>Đổi mật khẩu</h2>
            <form className="flex-col" style={{ gap: "1.2rem" }} onSubmit={handlePasswordSubmit}>
                {/* <p className="h4">Nhập mật khẩu mới cho tài khoản của bạn</p> */}
                <div className={styles["form-group"]}>
                    <label htmlFor="password">Mật khẩu cũ</label>
                    <div className={styles["input-field"]}>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="old"
                            name="old"
                            value={formData.old}
                            onChange={handlePasswordChange}
                            placeholder="Nhập mật khẩu cũ"
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
                    <label htmlFor="password">Mật khẩu mới</label>
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
                    <label htmlFor="password">Xác nhận mật khẩu mới</label>
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
                {message && <div className={`${styles["error-message"]} flex-row align-center`} style={{ backgroundColor: "forestgreen" }}>
                    <FaInfoCircle />
                    {message}
                </div>}
                {changePasswordError && <div className={`${styles["error-message"]} flex-row align-center`}>
                    <ImWarning />
                    {changePasswordError}
                </div>}
                <button type="submit" className={`${styles["button"]} ${styles["login-button"]}`}
                    disabled={formData.old === '' || formData.password === '' || formData.verify === ''}
                    style={{ cursor: formData.old === '' || formData.password === '' || formData.verify === '' ? "not-allowed" : "pointer" }}
                >
                    {loadingChangePassword ? <BiLoaderCircle className={styles["loading-icon"]} /> : "Xác nhận"}
                </button>
            </form>
        </div>
    </div>
}

export default ChangePassword;