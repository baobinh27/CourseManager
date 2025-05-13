import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { BASE_API } from '../utils/constant'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (accessToken, refreshToken) => {
    const decoded = jwtDecode(accessToken);

    const userData = {
      userId: decoded.userId,
      accessToken,
      refreshToken,
    };
    setUser(userData);

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const res = await fetch(`${BASE_API}/api/user/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) throw new Error("Refresh token thất bại");

      const data = await res.json();

      const newAccessToken = data.accessToken;
      const decoded = jwtDecode(newAccessToken);

      console.log("Access token mới:", data.accessToken);

      const updatedUser = {
        userId: decoded.userId,
        accessToken: newAccessToken,
        refreshToken,
      };

      setUser(updatedUser);
      localStorage.setItem("accessToken", newAccessToken);
    } catch (err) {
      console.error("Refresh token thất bại:", err);
      logout();
    }
  }, [logout]);

  // Auto login khi app khởi động
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            userId: decoded.userId,
            accessToken,
            refreshToken: localStorage.getItem("refreshToken"),
          });
        } else {
          refreshAccessToken();
        }
      } catch (err) {
        console.error("Lỗi giải mã accessToken:", err);
        logout();
      }
    } else {
      refreshAccessToken(); // Thử refresh nếu chưa có accessToken
    }
  }, [refreshAccessToken, logout]);

  useEffect(() => {
  // Tự động refresh token mỗi 30 phút
  const interval = setInterval(() => {
    refreshAccessToken();
  }, 30 * 60 * 1000);

  return () => clearInterval(interval); // Cleanup khi component unmount
}, [refreshAccessToken]);

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const login = async (token) => {    
//     const decoded = jwtDecode(token);

//     const userData = {
//       userId: decoded.userId,
//       token,
//     };
//     setUser(userData);
//     localStorage.setItem('token', token);
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('token');
//   };

//    // Auto login khi app khởi động
//    useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);

//         // Kiểm tra token hết hạn chưa (nếu muốn chắc chắn hơn)
//         if (decoded.exp * 1000 > Date.now()) {
//           setUser({
//             userId: decoded.userId,
//             token,
//           });
//         } else {
//           localStorage.removeItem('token');
//         }
//       } catch (err) {
//         console.error('Lỗi giải mã token:', err);
//         localStorage.removeItem('token');
//       }
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

export const useAuth = () => useContext(AuthContext);
