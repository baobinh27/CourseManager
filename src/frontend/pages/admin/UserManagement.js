import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { BASE_API } from '../../utils/constant';
import styles from './UserManagement.module.css';
import { BiLoaderCircle } from 'react-icons/bi';
import { FaEdit, FaUserCog, FaUserCheck, FaBan, FaSearch, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // 10 users per page
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('Bạn cần đăng nhập để xem trang này');
        return;
      }

      // Kiểm tra role admin
      try {
        const decoded = jwtDecode(token);
        if (decoded.role !== 'admin') {
          setError('Bạn không có quyền truy cập trang này');
          navigate('/unauthorized');
          return;
        }
      } catch (err) {
        console.error('Lỗi giải mã token:', err);
        setError('Phiên đăng nhập không hợp lệ');
        return;
      }

      console.log('Fetching users from API');
      const response = await fetch(`${BASE_API}/api/user/admin/all-users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched users:', data);
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi tải danh sách người dùng:', err);
      setError(`Không thể tải danh sách người dùng: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser({
      ...user,
      originalRole: user.role
    });
  };

  const handleCancel = () => {
    setEditingUser(null);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này');
        return;
      }

      // Log request details
      console.log('Cập nhật người dùng:', editingUser._id);
      console.log('Vai trò mới:', editingUser.role);

      // Sử dụng API mới thêm vào backend
      const updateEndpoint = `${BASE_API}/api/user/update-role/${editingUser._id}`;
      console.log('API endpoint:', updateEndpoint);

      const response = await fetch(updateEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role: editingUser.role
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lỗi API response text:', errorText);
        throw new Error(`Lỗi: ${response.status}`);
      }

      const updatedUser = await response.json();
      console.log('Cập nhật thành công:', updatedUser);
      
      // Cập nhật danh sách người dùng
      fetchUsers();

      setEditingUser(null);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi cập nhật người dùng:', err);
      setError(`Không thể cập nhật thông tin người dùng: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (user) => {
    setDeletingUser(user);
  };

  const handleCancelDelete = () => {
    setDeletingUser(null);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này');
        return;
      }

      // Log request details
      console.log('Xóa người dùng:', deletingUser._id);

      // Sử dụng API mới thêm vào backend
      const deleteEndpoint = `${BASE_API}/api/user/delete/${deletingUser._id}`;
      console.log('API endpoint:', deleteEndpoint);

      const response = await fetch(deleteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lỗi API response text:', errorText);
        throw new Error(`Lỗi: ${response.status}`);
      }

      console.log('Xóa thành công');
      
      // Cập nhật danh sách người dùng sau khi xóa
      fetchUsers();
      
      setDeletingUser(null);
      setError(null);
      
      // Adjust current page if necessary after deletion
      if (currentUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.error('Lỗi khi xóa người dùng:', err);
      setError(`Không thể xóa người dùng: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    setEditingUser({
      ...editingUser,
      role: e.target.value
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Filtered users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Calculate current users to display
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case 'admin': return 'Quản trị viên';
      case 'user': return 'Người dùng';
      case 'banned': return 'Bị khóa';
      case 'undefined': return 'Không xác định';
      default: return 'Người dùng';
    }
  };

  const getRoleClassName = (role) => {
    switch(role) {
      case 'admin': return styles.roleadmin;
      case 'user': return styles.roleuser;
      case 'banned': return styles.rolebanned;
      default: return styles.roleuser;
    }
  };

  return (
    <AdminLayout>
      <div className={styles.userManagementContainer}>
        <div className={styles.headerSection}>
          <h1>Quản lý người dùng</h1>
        </div>
        
        {error && (
          <div className={styles.error}>
            {error}
            <button 
              className={styles.reloadButton}
              onClick={fetchUsers}
              disabled={loading}
            >
              {loading ? <BiLoaderCircle className={styles.buttonIcon} /> : 'Tải lại'}
            </button>
          </div>
        )}
        
        <div className={styles.filters}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <FaSearch className={styles.searchIcon} />
          </div>
          
          <div className={styles.filterGroup}>
            <select 
              value={roleFilter} 
              onChange={handleRoleFilterChange}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="user">Người dùng</option>
              <option value="banned">Bị khóa</option>
            </select>
          </div>
        </div>
        
        {loading && !editingUser ? (
          <div className={styles.loadingContainer}>
            <BiLoaderCircle className={styles.loadingIcon} />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.courseTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên người dùng</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.length > 0 ? (
                  currentUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td className={styles.roleCell}>
                        <span className={`${styles.roleLabel} ${getRoleClassName(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={`${styles.actionButton} ${styles.editButton}`} 
                            onClick={() => handleEdit(user)}
                            title="Chỉnh sửa thông tin người dùng"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className={`${styles.actionButton} ${styles.deleteButton}`} 
                            onClick={() => handleDelete(user)}
                            title="Xóa người dùng"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.noData}>
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination controls */}
            {filteredUsers.length > 0 && (
              <div className={styles.paginationContainer}>
                <button 
                  onClick={prevPage} 
                  disabled={currentPage === 1} 
                  className={styles.paginationButton}
                >
                  Trước
                </button>
                
                <div className={styles.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={`${styles.pageNumber} ${currentPage === i + 1 ? styles.activePage : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={nextPage} 
                  disabled={currentPage === totalPages} 
                  className={styles.paginationButton}
                >
                  Tiếp
                </button>
                
                <span className={styles.pageInfo}>
                  Trang {currentPage} / {totalPages} 
                  (Hiển thị {currentUsers.length} trong tổng số {filteredUsers.length} người dùng)
                </span>
              </div>
            )}
          </div>
        )}
        
        {editingUser && (
          <div className={styles.editModal}>
            <div className={styles.editModalContent}>
              <h2 className={styles.editModalTitle}>
                <FaUserCog className={styles.editModalIcon} />
                Chỉnh sửa người dùng
              </h2>
              
              <div className={styles.userInfo}>
                <p><strong>ID:</strong> {editingUser._id}</p>
                <p><strong>Tên người dùng:</strong> {editingUser.username}</p>
                <p><strong>Email:</strong> {editingUser.email}</p>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Vai trò:</label>
                <select 
                  value={editingUser.role} 
                  onChange={handleRoleChange}
                  className={styles.formSelect}
                >
                  <option value="user">Người dùng</option>
                  <option value="admin">Quản trị viên</option>
                  <option value="banned">Bị khóa</option>
                </select>
              </div>
              
              <div className={styles.editModalButtons}>
                <button 
                  className={styles.saveButton} 
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? <BiLoaderCircle className={styles.buttonIcon} /> : <FaUserCheck className={styles.buttonIcon} />}
                  Lưu thay đổi
                </button>
                <button 
                  className={styles.cancelButton} 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <FaBan className={styles.buttonIcon} />
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        )}

        {deletingUser && (
          <div className={styles.editModal}>
            <div className={styles.deleteModalContent}>
              <h2 className={styles.deleteModalTitle}>
                <FaExclamationTriangle className={styles.deleteModalIcon} />
                Xác nhận xóa người dùng
              </h2>
              
              <div className={styles.deleteWarning}>
                <p>Bạn có chắc chắn muốn xóa người dùng sau đây?</p>
                <div className={styles.userInfo}>
                  <p><strong>ID:</strong> {deletingUser._id}</p>
                  <p><strong>Tên người dùng:</strong> {deletingUser.username}</p>
                  <p><strong>Email:</strong> {deletingUser.email}</p>
                  <p><strong>Vai trò:</strong> {getRoleLabel(deletingUser.role)}</p>
                </div>
                <p className={styles.deleteMessage}>
                  Hành động này không thể hoàn tác và tất cả dữ liệu liên quan đến người dùng này sẽ bị xóa vĩnh viễn.
                </p>
              </div>
              
              <div className={styles.editModalButtons}>
                <button 
                  className={styles.deleteConfirmButton} 
                  onClick={handleConfirmDelete}
                  disabled={loading}
                >
                  {loading ? <BiLoaderCircle className={styles.buttonIcon} /> : <FaTrash className={styles.buttonIcon} />}
                  Xác nhận xóa
                </button>
                <button 
                  className={styles.cancelButton} 
                  onClick={handleCancelDelete}
                  disabled={loading}
                >
                  <FaBan className={styles.buttonIcon} />
                  Hủy bỏ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
