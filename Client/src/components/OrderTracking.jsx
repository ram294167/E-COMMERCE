import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderTracking = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_URL}/api/user-orders/${user.id}`);
      setOrders(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#ff9f43';
      case 'confirmed':
        return '#2874f0';
      case 'shipped':
        return '#0984e3';
      case 'delivered':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#878787';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✓';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '✓✓';
      case 'cancelled':
        return '✕';
      default:
        return '📦';
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Please login to track your orders</h2>
      </div>
    );
  }

  return (
    <div className="order-tracking-container">
      <div className="order-tracking-header">
        <h2>📦 Track Your Orders</h2>
        <button className="refresh-btn" onClick={fetchOrders} disabled={loading}>
          {loading ? '⏳ Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="no-orders">
          <p>📭 You haven't placed any orders yet!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div 
                className="order-header"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p className="order-date">📅 {new Date(order.order_date).toLocaleDateString()}</p>
                </div>
                <div className="order-status" style={{ borderLeft: `4px solid ${getStatusColor(order.status)}` }}>
                  <span className="status-icon">{getStatusIcon(order.status)}</span>
                  <span className="status-text" style={{ color: getStatusColor(order.status) }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="order-total">
                  <p className="total-label">Total Amount</p>
                  <p className="total-price">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                </div>
                <span className="expand-icon">{expandedOrder === order.id ? '▲' : '▼'}</span>
              </div>

              {expandedOrder === order.id && (
                <div className="order-details">
                  <div className="details-section">
                    <h4>📍 Delivery Address</h4>
                    <p>{order.delivery_address || 'Not provided'}</p>
                  </div>

                  <div className="details-section">
                    <h4>📦 Order Items</h4>
                    {order.items && order.items.length > 0 ? (
                      <table className="order-items-table">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.map((item, idx) => (
                            <tr key={idx}>
                              <td>{item.name || 'Product'}</td>
                              <td>{item.quantity}</td>
                              <td>₹{parseFloat(item.price).toFixed(2)}</td>
                              <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No items found</p>
                    )}
                  </div>

                  <div className="details-section">
                    <h4>💳 Payment Status</h4>
                    <p>{order.payment_status || 'Pending'}</p>
                  </div>

                  <div className="timeline">
                    <h4>📅 Timeline</h4>
                    <div className="timeline-items">
                      <div className={`timeline-item ${order.status !== 'pending' ? 'active' : ''}`}>
                        <span className="timeline-dot">✓</span>
                        <span className="timeline-label">Order Placed</span>
                      </div>
                      <div className={`timeline-item ${['confirmed', 'shipped', 'delivered'].includes(order.status) ? 'active' : ''}`}>
                        <span className="timeline-dot">✓</span>
                        <span className="timeline-label">Confirmed</span>
                      </div>
                      <div className={`timeline-item ${['shipped', 'delivered'].includes(order.status) ? 'active' : ''}`}>
                        <span className="timeline-dot">🚚</span>
                        <span className="timeline-label">Shipped</span>
                      </div>
                      <div className={`timeline-item ${order.status === 'delivered' ? 'active' : ''}`}>
                        <span className="timeline-dot">✓</span>
                        <span className="timeline-label">Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
