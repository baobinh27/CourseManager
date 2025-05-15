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
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  
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

      const response = await fetch(`${BASE_API}/api/user/admin/all-users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status}`);
      }

      const data = await response.json();
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
      originalRole: user.role,
      originalStatus: user.status || 'active'
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

      const response = await fetch(`${BASE_API}/api/user/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role: editingUser.role,
          status: editingUser.status
        })
      });

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status}`);
      }

      const updatedUser = await response.json();
      
      // Cập nhật danh sách người dùng
      setUsers(users.map(user => 
        user._id === updatedUser._id ? updatedUser : user
      ));
      
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

      const response = await fetch(`${BASE_API}/api/user/${deletingUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Lỗi: ${response.status}`);
      }

      // Cập nhật danh sách người dùng sau khi xóa
      setUsers(users.filter(user => user._id !== deletingUser._id));
      setDeletingUser(null);
      setError(null);
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

  const handleStatusChange = (e) => {
    setEditingUser({
      ...editingUser,
      status: e.target.value
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };

  // Lọc người dùng dựa trên các bộ lọc
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter || 
      (statusFilter === 'active' && !user.status); // Xử lý trường hợp không có trạng thái coi như 'active'
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getRoleLabel = (role) => {
    switch(role) {
      case 'admin': return 'Quản trị viên';
      case 'user': return 'Người dùng';
      default: return 'Không xác định';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'active': return 'Hoạt động';
      case 'suspended': return 'Tạm khóa';
      case 'banned': return 'Cấm vĩnh viễn';
      default: return 'Hoạt động';
    }
  };

  const getStatusClassName = (status) => {
    switch(status) {
      case 'active': return styles.statusActive;
      case 'suspended': return styles.statusSuspended;
      case 'banned': return styles.statusBanned;
      default: return styles.statusActive;
    }
  };

  return (
    <AdminLayout>
      <div className={styles.userManagement}>
        <h1 className={styles.title}>Quản lý người dùng</h1>
        
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
              value={statusFilter} 
              onChange={handleStatusFilterChange}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="suspended">Tạm khóa</option>
              <option value="banned">Cấm vĩnh viễn</option>
            </select>
            
            <select 
              value={roleFilter} 
              onChange={handleRoleFilterChange}
              className={styles.filterSelect}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="admin">Quản trị viên</option>
              <option value="user">Người dùng</option>
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
            <table className={styles.usersTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên người dùng</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td className={styles.roleCell}>
                        <span className={`${styles.roleLabel} ${styles[`role${user.role}`]}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.statusLabel} ${getStatusClassName(user.status)}`}>
                          {getStatusLabel(user.status)}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button 
                            className={styles.editButton} 
                            onClick={() => handleEdit(user)}
                            title="Chỉnh sửa thông tin người dùng"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className={styles.deleteButton} 
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
                    <td colSpan="6" className={styles.noData}>
                      Không tìm thấy người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Trạng thái:</label>
                <select 
                  value={editingUser.status || 'active'} 
                  onChange={handleStatusChange}
                  className={styles.formSelect}
                >
                  <option value="active">Hoạt động</option>
                  <option value="suspended">Tạm khóa</option>
                  <option value="banned">Cấm vĩnh viễn</option>
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
