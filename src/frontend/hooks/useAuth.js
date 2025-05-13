import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuth as useAuthContext } from '../api/auth';

export const useAuth = () => {
  const { refreshAccessToken } = useAuthContext();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      let token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          setIsLoggedIn(true);
          setUserInfo(decoded);
        } else {
          // setIsLoggedIn(false);
          // localStorage.removeItem('accessToken'); // Xoá token hết hạn

          console.log('Token hết hạn, đang gọi refresh từ AuthProvider...');
          token = await refreshAccessToken();

          if (token) {
            const newDecoded = jwtDecode(token);
            setIsLoggedIn(true);
            setUserInfo(newDecoded);
          } else {
            setIsLoggedIn(false);
            setUserInfo(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }
      } catch (err) {
        console.error("Token không hợp lệ:", err);
        setIsLoggedIn(false);
        setUserInfo(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    checkAuth();
  }, [refreshAccessToken]);

  return { isLoggedIn, userInfo };
};