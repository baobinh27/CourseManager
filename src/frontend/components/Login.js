import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
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
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">Đăng nhập</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
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
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <button type="submit" className="button login-button">
                        Đăng nhập
                    </button>
                </form>

                <div className="divider">
                    <span>HOẶC</span>
                </div>

                <button 
                    className="button google-login"
                    onClick={handleGoogleLogin}
                >
                    <img 
                        src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" 
                        alt="Google logo"
                    />
                    Đăng nhập với Google
                </button>

                <Link to="/register" className="button register-button">
                    Đăng ký tài khoản mới
                </Link>

                <Link to="/" className="button home-button">
                    Quay lại trang chủ
                </Link>
            </div>
        </div>
    );
};

export default Login; 