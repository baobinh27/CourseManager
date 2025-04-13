import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Login.module.css';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginButtonState, setLoginButtonState] = useState(0);
    const loginButtonStates = ["Đăng nhập", "...", "Đăng nhập thành công! Quay lại..."];

    const navigate = useNavigate();

    useEffect(() => {
        if (!error) return;
        setTimeout(() => {setError('')}, 2000);
    }, [error])

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
        setLoginButtonState(1);

        try {
            const response = await fetch('http://localhost:5000/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setLoginButtonState(2);
                localStorage.setItem('token', data.token);
                setTimeout(() => {navigate('/')}, 1000)
                            
            } else {
                setLoginButtonState(0);
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            setLoginButtonState(0);
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
            {error ? <div className={`${styles["error-dialog"]} flex-row justify-center align-center`}>
                <FaExclamationCircle />
                {error}
            </div> : null}
            <div className={styles["login-box"]}>
                <div className={styles["login-header"]}>
                    <Link to="/" className={styles["back-home"]}>
                        <FaArrowLeft /> Quay lại trang chủ
                    </Link>
                </div>

                <h2 className={styles["login-title"]}>Đăng nhập</h2>
                <form className={styles["login-form"]} onSubmit={handleSubmit}>
                    <div className={styles["form-group"]}>
                        <label htmlFor="email">Tên đăng nhập</label>
                        <div className={styles["input-field"]}>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Nhập email của bạn"
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
                    {/* {error && <div className={styles["error-message"]}>{error}</div>} */}
                    <button type="submit" className={`${styles["button"]} ${styles["login-button"]}`}
                        disabled={loginButtonState !== 0}
                        style={{cursor: loginButtonState === 0 ? "pointer" : "not-allowed"}}
                    >
                        {loginButtonStates[loginButtonState]}
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