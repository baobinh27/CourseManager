import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const AdminRoute = ({ children }) => {
  let token = localStorage.getItem('accessToken');
  if (!token) return <Navigate to="/unauthorized" replace />;

  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000;

  if (decoded.exp < currentTime) return <Navigate to="/unauthorized" replace />;

  if (decoded?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AdminRoute;
