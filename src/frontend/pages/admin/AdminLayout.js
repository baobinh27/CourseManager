import React, { useState } from "react";
import styles from "./AdminLayout.module.css"; // Use a new CSS module for the layout

const AdminLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>Admin Panel</div>
        <nav className={styles.nav}>
          <a href="/admin" className={styles.navItem}>📊 Dashboard</a>
          <a href="/admin/payment-verification" className={styles.navItem}>💳 Xác thực thanh toán</a>
          <a href="/admin/course-approval" className={styles.navItem}>📚 Kiểm duyệt khóa học</a>
          <a href="/admin/user-management" className={styles.navItem}>👥 Quản lý người dùng</a>
          <a href="/admin/course-management" className={styles.navItem}>📝 Quản lý khóa học</a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={styles.main}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <button onClick={toggleMenu} className={styles.profileButton}>
              <span>Admin</span>
              <div className={styles.profileIcon}>A</div>
            </button>
            {menuOpen && (
              <div className={styles.dropdownMenu}>
                <a href="/logout" className={styles.dropdownItem}>Đăng xuất</a> {/* Assuming a logout route */}
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
