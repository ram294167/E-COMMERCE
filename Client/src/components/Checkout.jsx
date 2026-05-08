import React, { useState } from 'react';
import axios from 'axios';

const Checkout = ({ cart, user, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India'
  });
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [paymentProof, setPaymentProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const total = cart.reduce((sum, item) => sum + item.cost * (item.quantity || 1), 0);

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const handleProofChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/api/addresses`, {
        user_id: user.id,
        ...address
      });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create order
      const orderResponse = await axios.post(`${API_URL}/api/orders`, {
        user_id: user.id,
        total_amount: total,
        items: cart.map(item => ({
          item_id: item.id,
          quantity: item.quantity || 1,
          cost: item.cost
        }))
      });

      const orderId = orderResponse.data.orderId;

      // Upload payment proof
      if (paymentProof) {
        const formData = new FormData();
        formData.append('proof', paymentProof);
        formData.append('order_id', orderId);
        formData.append('amount', total);
        formData.append('payment_method', paymentMethod);

        await axios.post(`${API_URL}/api/payment`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      alert('Order placed successfully! Order ID: ' + orderId);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to process order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      
      {step === 1 && (
        <form onSubmit={handleAddressSubmit} className="checkout-form">
          <h3>Delivery Address</h3>
          
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleAddressChange}
              placeholder="123 Main St"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleAddressChange}
                placeholder="New York"
                required
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleAddressChange}
                placeholder="NY"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Postal Code</label>
              <input
                type="text"
                name="postal_code"
                value={address.postal_code}
                onChange={handleAddressChange}
                placeholder="10001"
                required
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                disabled
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-next" disabled={loading}>
            {loading ? 'Saving...' : 'Continue to Payment'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handlePaymentSubmit} className="checkout-form">
          <h3>Payment Details</h3>
          
          <div className="order-summary">
            <h4>Order Summary</h4>
            {cart.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.name} x {item.quantity || 1}</span>
                <span>₹{item.cost * (item.quantity || 1)}</span>
              </div>
            ))}
            <div className="summary-total">
              <strong>Total: ₹{total.toFixed(2)}</strong>
            </div>
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Upload Payment Proof</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProofChange}
              required
            />
            <small>Upload screenshot of payment confirmation</small>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="checkout-buttons">
            <button 
              type="button" 
              className="btn-back"
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;
