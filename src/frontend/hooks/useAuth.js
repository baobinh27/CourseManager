import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp > currentTime) {
        setIsLoggedIn(true);
        setUserInfo(decoded);
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem('token'); // Xoá token hết hạn
      }
    } catch (err) {
      console.error("Token không hợp lệ:", err);
    }
  }, []);

  return { isLoggedIn, userInfo };
};