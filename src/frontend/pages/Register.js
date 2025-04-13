import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import { FaArrowLeft, FaExclamationCircle,  } from 'react-icons/fa';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [signupButtonState, setSignupButtonState] = useState(0);
    const signupButtonStates = ["Đăng ký", "...", "Đăng ký thành công! Quay lại..."];

    useEffect(() => {
        if (!error) return;
        setTimeout(() => {setError('')}, 2000);
    }, [error])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSignupButtonState(1);

        if (formData.password !== formData.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            setSignupButtonState(0);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/user/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.status === 201) {
                setSignupButtonState(2);
                setTimeout(() => {navigate('/login');}, 2000);
                
            } else {
                setSignupButtonState(0);
                setError(data.message || 'Signup failed. Please try again.');
            }
        } catch (err) {
            setSignupButtonState(0);
            setError('An error occurred. Please try again later.');
            console.error('Signup error:', err);
        }
        
    };

    return (
        <div className={styles.container}>
            <div className={styles.background}></div>
            {error ? <div className={`${styles["error-dialog"]} flex-row justify-center align-center`}>
                <FaExclamationCircle />
                {error}
            </div> : null}
            <div className={styles.formContainer}>
                <div className={styles["signup-header"]}>
                    <Link to="/" className={styles["back-home"]}>
                        <FaArrowLeft /> Quay lại trang chủ
                    </Link>
                </div>
                <h1 className={styles.title}>Đăng ký tài khoản</h1>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email của bạn"
                        />
                    </div>

                    {/* {error && <p className={styles.error}>{error}</p>} */}

                    <button type="submit" className={styles.submitButton} disabled={signupButtonState !== 0} style={{cursor: signupButtonState === 0 ? "pointer" : "not-allowed"}}>
                        {signupButtonStates[signupButtonState]}
                    </button>
                </form>

                <Link to="/Login" className={styles.backButton}>
                    Quay lại trang đăng nhập
                </Link>
            </div>
        </div>
    );
}

export default Register; 