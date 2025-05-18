import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import styles from './PaymentVerification.module.css';
import { BiLoaderCircle } from 'react-icons/bi';
import { FaCheckCircle, FaTimesCircle, FaSearch, FaEye, FaExclamationTriangle, FaFilter } from 'react-icons/fa';
import useGetAdminOrders from '../../hooks/useGetAdminOrders';

const PaymentVerification = () => {
  const { orders, loading, error, processOrder } = useGetAdminOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [noteFromAdmin, setNoteFromAdmin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10); // Hiển thị 10 đơn hàng mỗi trang

  // Hàm xử lý tìm kiếm đơn hàng
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  };

  // Hàm xử lý lọc theo trạng thái
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset về trang đầu tiên khi thay đổi bộ lọc
  };

  // Hàm mở modal xem chi tiết đơn hàng
  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setNoteFromAdmin('');
  };

  // Hàm đóng modal
  const closeOrderDetails = () => {
    setSelectedOrder(null);
    setNoteFromAdmin('');
    setSuccessMessage('');
  };

  // Hàm xử lý duyệt đơn hàng
  const handleApprove = async () => {
    if (!selectedOrder) return;
    
    setProcessing(true);
    const result = await processOrder(selectedOrder._id, 'approve', noteFromAdmin);
    setProcessing(false);
    
    if (result) {
      setSuccessMessage('Đơn hàng đã được duyệt thành công!');
      setTimeout(() => {
        closeOrderDetails();
      }, 2000);
    }
  };

  // Hàm xử lý từ chối đơn hàng
  const handleReject = async () => {
    if (!selectedOrder || !noteFromAdmin) {
      alert('Vui lòng nhập lý do từ chối đơn hàng');
      return;
    }
    
    setProcessing(true);
    const result = await processOrder(selectedOrder._id, 'reject', noteFromAdmin);
    setProcessing(false);
    
    if (result) {
      setSuccessMessage('Đơn hàng đã bị từ chối!');
      setTimeout(() => {
        closeOrderDetails();
      }, 2000);
    }
  };

  // Lọc danh sách đơn hàng theo tìm kiếm và trạng thái
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.userId?.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.courseId?.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      false;
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Tính toán chỉ mục của đơn hàng đầu tiên và cuối cùng trên trang hiện tại
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  
  // Lấy danh sách đơn hàng trên trang hiện tại
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  // Tính tổng số trang
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  // Hàm thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Hàm chuyển đến trang tiếp theo
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Hàm quay lại trang trước
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format phương thức thanh toán
  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'bank_tranfer': return 'Chuyển khoản ngân hàng';
      case 'momo': return 'Momo';
      case 'zalo_pay': return 'ZaloPay';
      default: return method;
    }
  };

  // Format trạng thái đơn hàng
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return styles.statusPending;
      case 'approved': return styles.statusApproved;
      case 'rejected': return styles.statusRejected;
      default: return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Đã từ chối';
      default: return status;
    }
  };

  // Format thời gian
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className={styles.paymentVerificationContainer}>
        <div className={styles.headerSection}>
          <h1>Xác Thực Thanh Toán</h1>
        </div>

        <div className={styles.filterSection}>
          <div className={styles.searchWrapper}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Tìm kiếm theo tên người dùng, email hoặc khóa học..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <div className={styles.statusFilterWrapper}>
            <FaFilter style={{ marginRight: '8px', color: '#666' }} />
            <select
              className={styles.statusFilter}
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Đã từ chối</option>
            </select>
          </div>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className={styles.loadingContainer}>
            <BiLoaderCircle className={styles.loadingIcon} />
            <p>Đang tải danh sách đơn hàng...</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            {filteredOrders.length > 0 ? (
              <>
                <table className={styles.ordersTable}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Người dùng</th>
                      <th>Khóa học</th>
                      <th>Số tiền</th>
                      <th>Phương thức</th>
                      <th>Ngày tạo</th>
                      <th>Trạng thái</th>
                      <th style={{ textAlign: 'center' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id.substring(0, 8)}...</td>
                        <td>{order.userId?.username || order.userId?.email || 'N/A'}</td>
                        <td className={styles.courseName}>{order.courseId?.name || 'N/A'}</td>
                        <td><strong>{formatCurrency(order.amount)}</strong></td>
                        <td>{formatPaymentMethod(order.paymentMethod)}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>
                          <span className={`${styles.statusLabel} ${getStatusClass(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div className={styles.actions}>
                            <button
                              className={styles.viewButton}
                              onClick={() => openOrderDetails(order)}
                            >
                              <FaEye />
                              <span>Xem</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Phân trang */}
                {totalPages > 1 && (
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
                      (Hiển thị {currentOrders.length} trong tổng số {filteredOrders.length} đơn hàng)
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className={styles.noOrders}>
                <p>Không tìm thấy đơn hàng nào phù hợp với điều kiện tìm kiếm.</p>
              </div>
            )}
          </div>
        )}

        {/* Modal xem chi tiết đơn hàng */}
        {selectedOrder && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>Chi tiết đơn hàng</h2>
                <button className={styles.closeButton} onClick={closeOrderDetails}>×</button>
              </div>
              
              {successMessage ? (
                <div className={styles.successMessage}>
                  <FaCheckCircle className={styles.successIcon} />
                  <p>{successMessage}</p>
                </div>
              ) : (
                <>
                  <div className={styles.modalBody}>
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>ID đơn hàng:</span>
                      <span className={styles.detailValue}>{selectedOrder._id}</span>
                    </div>
                    
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>Người dùng:</span>
                      <span className={styles.detailValue}>{selectedOrder.userId?.username || 'N/A'}</span>
                    </div>
                    
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>Email:</span>
                      <span className={styles.detailValue}>{selectedOrder.userId?.email || 'N/A'}</span>
                    </div>
                    
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>Khóa học:</span>
                      <span className={styles.detailValue}>{selectedOrder.courseId?.name || 'N/A'}</span>
                    </div>
                    
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>Số tiền:</span>
                      <span className={styles.detailValue}><strong>{formatCurrency(selectedOrder.amount)}</strong></span>
                    </div>
                    
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>Phương thức thanh toán:</span>
                      <span className={styles.detailValue}>{formatPaymentMethod(selectedOrder.paymentMethod)}</span>
                    </div>
                    
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>Ngày tạo:</span>
                      <span className={styles.detailValue}>{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    
                    <div className={styles.orderDetail}>
                      <span className={styles.detailLabel}>Trạng thái:</span>
                      <span className={`${styles.detailValue} ${getStatusClass(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </div>
                    
                    {selectedOrder.note && (
                      <div className={styles.orderDetail}>
                        <span className={styles.detailLabel}>Ghi chú từ người dùng:</span>
                        <span className={styles.detailValue}>{selectedOrder.note}</span>
                      </div>
                    )}
                    
                    {selectedOrder.status === 'rejected' && selectedOrder.noteFromAdmin && (
                      <div className={styles.orderDetail}>
                        <span className={styles.detailLabel}>Lý do từ chối:</span>
                        <span className={styles.detailValue}>{selectedOrder.noteFromAdmin}</span>
                      </div>
                    )}
                    
                    {selectedOrder.status === 'pending' && (
                      <div className={styles.adminNoteArea}>
                        <label htmlFor="adminNote">Ghi chú của Admin:</label>
                        <textarea
                          id="adminNote"
                          value={noteFromAdmin}
                          onChange={(e) => setNoteFromAdmin(e.target.value)}
                          placeholder="Nhập ghi chú cho đơn hàng này (bắt buộc khi từ chối)"
                          className={styles.adminNoteInput}
                        />
                      </div>
                    )}
                  </div>
                  
                  {selectedOrder.status === 'pending' && (
                    <div className={styles.modalFooter}>
                      <button
                        className={styles.approveButton}
                        onClick={handleApprove}
                        disabled={processing}
                      >
                        {processing ? (
                          <BiLoaderCircle className={styles.buttonLoader} />
                        ) : (
                          <FaCheckCircle />
                        )}
                        <span>Duyệt đơn</span>
                      </button>
                      
                      <button
                        className={styles.rejectButton}
                        onClick={handleReject}
                        disabled={processing}
                      >
                        {processing ? (
                          <BiLoaderCircle className={styles.buttonLoader} />
                        ) : (
                          <FaTimesCircle />
                        )}
                        <span>Từ chối</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PaymentVerification; 