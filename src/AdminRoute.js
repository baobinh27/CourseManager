import { Navigate } from "react-router-dom";
import { useAuth } from "./frontend/hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { userInfo } = useAuth();

  if (userInfo?.role !== "admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AdminRoute;
