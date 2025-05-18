import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AdminLayout.module.css"; // Use a new CSS module for the layout
import { useAuth } from "../../api/auth";
import { FaChartBar, FaCreditCard, FaBook, FaUsers, FaGraduationCap, FaSignOutAlt, FaUserCog } from 'react-icons/fa';

const AdminLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>Admin Panel</div>
        <nav className={styles.nav}>
          <Link to="/admin" className={styles.navItem}>
            <FaChartBar className={styles.navIcon} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/payment-verification" className={styles.navItem}>
            <FaCreditCard className={styles.navIcon} />
            <span>Xác thực thanh toán</span>
          </Link>
          <Link to="/admin/course-approval" className={styles.navItem}>
            <FaBook className={styles.navIcon} />
            <span>Kiểm duyệt khóa học</span>
          </Link>
          <Link to="/admin/user-management" className={styles.navItem}>
            <FaUsers className={styles.navIcon} />
            <span>Quản lý người dùng</span>
          </Link>
          <Link to="/admin/course-management" className={styles.navItem}>
            <FaGraduationCap className={styles.navIcon} />
            <span>Quản lý khóa học</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <button onClick={toggleMenu} className={styles.profileButton}>
              <span>Admin</span>
              <div className={styles.profileIcon}><FaUserCog /></div>
            </button>
            {menuOpen && (
              <div className={styles.dropdownMenu}>
                <button onClick={handleLogout} className={styles.dropdownItem}>
                  <FaSignOutAlt className={styles.dropdownIcon} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content Area - Render children passed to the component */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
