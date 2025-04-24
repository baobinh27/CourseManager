import React from "react";
import AdminLayout from "./AdminLayout"; // Import the layout component
// import styles from "./Dashboard.module.css"; // No longer need specific dashboard styles if covered by layout

const Dashboard = () => {
  return (
    <AdminLayout> {/* Wrap the content with AdminLayout */}
      {/* Content specific to the Dashboard page */}
      <h1>Chào mừng bạn đến với Admin Dashboard!</h1>
      <p>Chọn một chức năng từ sidebar để bắt đầu.</p>
    </AdminLayout>
  );
}

export default Dashboard;
