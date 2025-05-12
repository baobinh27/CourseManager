import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../api/auth';

export const ProtectedRoute = ({ requireAdmin = false }) => {
  const { user } = useAuth();
  
  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Nếu yêu cầu phải là admin và người dùng không phải admin, chuyển hướng đến trang chủ
  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Nếu đã đăng nhập và đáp ứng yêu cầu quyền, hiển thị các route con
  return <Outlet />;
};

export default ProtectedRoute; 