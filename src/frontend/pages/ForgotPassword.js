import { useState } from "react";
import styles from "./ForgotPassword.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { BiLoaderCircle } from "react-icons/bi";
import useRequestResetPassword from "../hooks/emails/useRequestResetPassword";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(0);

    const { sendRequest, loading: loadingSendRequest, error: sendRequestError } = useRequestResetPassword();

    const handleBack = () => {
        if (step === 0) navigate('/login')
        if (step === 1) {
            setStep(0);
        }
    }

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        await sendRequest(email, () => setStep(1));
        if (sendRequestError) {
            return;
        }
    }

    return <div className={styles.pageContainer}>
        <div className={styles.pageBackground}></div>
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={handleBack} className={styles.backBtn}>
                    <FaArrowLeft /> Quay lại
                </button>
            </div>

            <h2 className={styles.title}>Quên mật khẩu</h2>

            {step === 0 && <form className="flex-col" style={{ gap: "1.2rem" }} onSubmit={handleEmailSubmit}>
                <div className={styles["form-group"]}>
                    <label htmlFor="email">Email</label>
                    <div className={styles["input-field"]}>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email của bạn"
                        />
                    </div>
                </div>

                {sendRequestError && <div className={styles["error-message"]}>{sendRequestError}</div>}
                <button type="submit" className={`${styles["button"]} ${styles["login-button"]}`}
                    disabled={email === ''}
                    style={{ cursor: email !== '' ? "pointer" : "not-allowed" }}
                >
                    {loadingSendRequest ? <BiLoaderCircle className={styles["loading-icon"]} /> : "Tiếp tục"}
                </button>
            </form>}

            {step === 1 && <div className="flex-col" style={{ gap: "1.5rem" }}>
                <p className="h4">Vui lòng kiểm tra email xác thực đã được gửi đến <span style={{ color: "forestgreen", fontWeight: "bold" }}>{email}</span></p>
            </div>}
        </div>
    </div>
}

export default ForgotPassword;