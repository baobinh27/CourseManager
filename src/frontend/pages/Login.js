import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Login.module.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again later.');
            console.error('Login error:', err);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            // Implement Google OAuth login
            window.location.href = 'http://localhost:5000/api/auth/google';
        } catch (err) {
            setError('Google login failed. Please try again.');
            console.error('Google login error:', err);
        }
    };

    return (
        <div className={styles["login-container"]}>
            <div className={styles["login-background"]}></div>
            <div className={styles["login-box"]}>
                <div className={styles["login-header"]}>
                    <Link to="/" className={styles["back-home"]}>
                        <FaArrowLeft /> Quay lại trang chủ
                    </Link>
                </div>

                <h2 className={styles["login-title"]}>Đăng nhập</h2>
                <form className={styles["login-form"]} onSubmit={handleSubmit}>
                    <div className={styles["form-group"]}>
                        <label htmlFor="email">Email</label>
                        <div className={styles["input-field"]}>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Nhập email của bạn"
                                required
                            />
                        </div>
                    </div>
                    <div className={styles["form-group"]}>
                        <label htmlFor="password">Mật khẩu</label>
                        <div className={styles["input-field"]}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu"
                                required
            
                            />
                            <button
                                type="button"
                                className={styles["toggle-password"]}
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            
                        </div>
                        
                    </div>
        
                    <div className={styles["forgot-password"]}>
                        <Link to="/forgot-password">Quên mật khẩu?</Link>
                    </div>
                    {error && <div className={styles["error-message"]}>{error}</div>}
                    <button type="submit" className={`${styles["button"]} ${styles["login-button"]}`}>
                        Đăng nhập
                    </button>
                </form>

                <div className={styles["divider"]}>
                    <span>HOẶC</span>
                </div>

                <button 
                    className={`${styles["button"]} ${styles["google-login"]}`}
                    onClick={handleGoogleLogin}
                >
                    <img 
                        src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" 
                        alt="Google logo"
                    />{' '}
                    Đăng nhập với Google
                </button>

                <Link to="/register" className={`${styles["button"]} ${styles["register-button"]}`}>
                    Đăng ký tài khoản mới
                </Link>
            </div>
        </div>
    );
};

export default Login; 