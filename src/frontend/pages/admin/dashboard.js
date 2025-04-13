import React, { useState } from "react";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>Admin Panel</div>
        <nav className={styles.nav}>
          <a href="/" className={styles.navItem}>📊 Dashboard</a>
          <a href="/" className={styles.navItem}>💳 Xác thực thanh toán</a>
          <a href="/" className={styles.navItem}>📚 Kiểm duyệt khóa học</a>
          <a href="/" className={styles.navItem}>🚨 Xử lý báo cáo</a>
          <a href="/" className={styles.navItem}>👥 Quản lý người dùng</a>
          <a href="/" className={styles.navItem}>📝 Quản lý khóa học</a>
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
                <a href="/" className={styles.dropdownItem}>Đăng xuất</a>
              </div>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className={styles.content}>
          <h1>Chào mừng bạn đến với Admin Dashboard!</h1>
          <p>Chọn một chức năng từ sidebar để bắt đầu.</p>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;